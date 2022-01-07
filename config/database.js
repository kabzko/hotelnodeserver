const mysql = require('mysql');
module.exports =  mysqlconn = mysql.createPool({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b86c32fd56b449',
    password: 'db8b3d4f',
    database: 'heroku_576319729c24e04',
    multipleStatements: true
});

// module.exports =  mysqlconn = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'db_hotel',
//     multipleStatements: true
// });