const mysql = require('mysql');
module.exports =  mysqlconn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_hotel',
    multipleStatements: true
});