module.exports = {
    port: 8080,

    mongodb: {
        host: 'localhost',
        port: 27017,
        username: '',
        password: '',
        dbname: 'iotweb_class',
        get connectionUri() {
            return `mongodb://${this.host}:${this.port}/${this.dbname}`;
        },
    },

    session: {
        secret: '1ef41af4175fe164bf14a260fdf226218961c106',
    },
};
