/** Connection database **/
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'user_db',
    password: 'user332',
    database: 'cocktail'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

module.exports = connection;


