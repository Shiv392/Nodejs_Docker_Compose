const mysql = require('mysql2');

const pool = mysql.createPool({
    host : 'mysql', //container name of the mysql image container  in docker-compose.yml file. 
    user : 'root',
    password : 'root',
    database : 'testdb'
});

module.exports = pool;