/**
 * Created by lso on 17. 1. 1.
 */
var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = require('./connection');
var date = require('date-utils');
/* GET new group */
router.get('/', function(req, res, next) {
    res.render('group_add');
});
router.post('/', function(req, res, next){
    console.log("check");
    var presenttime = new Date();
    var present = presenttime.toFormat("YYYY-MM-DD HH24:MI:SS");
    console.log(present);
    var groupname = req.body.groupname;
    var group = {'create_date': present, 'groupname': groupname};
    connection.query('insert into Group set ?', group, function(err){
        if(err){
            console.error(err);
        }
        res.redirect('/');
    });
});
module.exports = router;