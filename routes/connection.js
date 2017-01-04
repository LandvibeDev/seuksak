/**
 * Created by jeong on 17. 1. 1.
 */
var mysql = require('mysql');

var connection =mysql.createConnection({
    host:'seuk.cxmh2e5ane0m.ap-northeast-2.rds.amazonaws.com', // rds 서버
    port:'33306',
    user:'seuksak',
    password:'tmrtkr3#',
    database:'seuksak'
});

module.exports = connection;