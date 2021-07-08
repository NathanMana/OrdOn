const mysql = require('mysql2/promise');
function chooseConnection(base) {
    return mysql.createPool({
        host: "localhost",
        user: "changeMe",
        password: "changeMe",
        database: base,
        waitForConnections : true,
    });
}

module.exports = chooseConnection

