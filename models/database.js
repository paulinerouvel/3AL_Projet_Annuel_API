'use strict';

const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

class Database {
    constructor() {
        this.connection = undefined;
        mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            Promise: bluebird
        }).then((connection) => {
            this.connection = connection
            console.log("Je suis connecté !");
        });
    }
}

module.exports = new Database();
