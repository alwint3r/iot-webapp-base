'use strict';

var InitMqttHandler = (function () {
    var MQTTClient;
    var PressureGauge;
    var LineChart;
    var SwitchControl;
    var LedIndicator;

    var ledIndicatorValue = 0;
    var roomPressureValue = 0;
    var temperatureData = [{
        time: new Date().toISOString(),
        value: 0,
    }];

    var CONTROL_TOPIC;
    var DATA_TOPIC;
    var MQTT_HOST;
    var MQTT_PORT;
    var MQTT_USER;
    var MQTT_PASSWORD;
    var MQTT_CLIENT_ID = 'winter-' + Date.now();

    function onSwitchClicked(event) {
        var newLedValue = ledIndicatorValue === 1 ? 0 : 1;
        var payload = {
            ledControl: newLedValue,
        };
        var message = new Paho.MQTT.Message(JSON.stringify(payload));
        message.destinationName = CONTROL_TOPIC;

        MQTTClient.send(message);
    }

    function updateLedIndicator(element, newValue) {
        if (newValue === 1) {
            element.removeClass('btn-default')
                .addClass('btn-warning');
        } else {
            element.removeClass('btn-warning')
                .addClass('btn-default');
        }
    }

    function onConnected() {
        console.log('Connected!');
        MQTTClient.subscribe(CONTROL_TOPIC);
        MQTTClient.subscribe(DATA_TOPIC);
    }

    function onConnectionLost(responseObject) {
        console.log('Connection lost: ', responseObject.errorMessage);
    }

    function onMessageArrived(message) {
        var topic = message.destinationName;
        var payload = message.payloadString;

        try {
            payload = JSON.parse(payload);
        } catch (ex) {
            payload = message.payloadString;
        }

        // Do something.
        if (topic === DATA_TOPIC) {
            PressureGauge.refresh(payload.roomPress);
            temperatureData.push({
                time: new Date().toISOString(),
                value: payload.roomTemp,
            });

            if (temperatureData.length > 20) {
                temperatureData.shift();
            }

            LineChart.setData(temperatureData);

            ledIndicatorValue = payload.indicLED;

            updateLedIndicator(LedIndicator, ledIndicatorValue);

        } else if (topic === CONTROL_TOPIC) {
            ledIndicatorValue = payload.ledControl;

            updateLedIndicator(LedIndicator, ledIndicatorValue);
        }

        console.log('Got: ', topic, '->', payload);
    }

    function initializeConnection() {
        MQTTClient = new Paho.MQTT.Client(MQTT_HOST, MQTT_PORT, MQTT_CLIENT_ID);
        MQTTClient.connect({
            onSuccess: onConnected,
            userName: MQTT_USER,
            password: MQTT_PASSWORD,
            useSSL: false,
        });

        MQTTClient.onConnectionLost = onConnectionLost;
        MQTTClient.onMessageArrived = onMessageArrived;
    }

    return {
        init: function () {
            CONTROL_TOPIC = $('[name="control_topic"]').val();
            DATA_TOPIC = $('[name="data_topic"]').val();
            MQTT_HOST = $('[name="host"]').val();
            MQTT_PORT = parseInt($('[name="port"]').val());
            MQTT_USER = $('[name="username"]').val();
            MQTT_PASSWORD = $('[name="password"]').val();

            PressureGauge = new JustGage({
                id: 'pressure-gauge',
                value: roomPressureValue,
                min: 85000,
                max: 120000,
                title: 'Room Pressure',
                label: 'Pa',
            });

            LineChart = new Morris.Line({
                element: 'temp-line-chart',
                data: temperatureData,
                xkey: 'time',
                ykeys: ['value'],
                labels: ['Value'],
            });

            LedIndicator = $('#led-indicator');
            SwitchControl = $('#switch-control');

            SwitchControl.on('click', onSwitchClicked);

            initializeConnection();
        },
    };
}());

$(document).ready(InitMqttHandler.init);
