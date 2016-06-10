'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const config = require('./config');

const app = express();
const initDatabase = require('./helpers/database');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true,
});

app.set('views', __dirname + '/views');
app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    name: 'iotwebapp.sess',
    resave: false,
    saveUninitialized: false,
    secret: config.session.secret,
    maxAge: new Date(Date.now() + 3600000)
}));
app.use(logger('dev'));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', (req, res, next) => {
    res.render('index.html', { name: 'Winter' });
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;

    return next(error);
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || 500;
    const response = {
        meta: {
            code: status,
            message: err.message,
        },
    };

    if (req.get('Accept') && req.get('Accept') === 'application/json') {
        return res.status(status).send(JSON.stringify(response));
    }

    return res.render('templates/error.html', response);
});

initDatabase(err => {
    if (err) {
        console.error('Failed to connect to database server');

        return process.exit(1);
    }

    const server = app.listen(config.port, () => {
        console.log('Node App is listening on port ' + config.port);
    });
});

process.on('uncaughtException', ex => {
    console.error('uncaughtException', ex.stack);
});

module.exports = app;
