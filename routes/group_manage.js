/**
 * Created by lso on 17. 1. 1.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var connection = require('./connection');
var date = require('date-utils');

var _result;
router.get('/', function(req, res, next) {

    console.log(req);
    connection.query('SELECT * FROM GroupMember WHERE user_id = ?',
        [req.user.id],function(error,result){
            if(error){
                console.log(error);
            }
            console.log(result);
            _result = result;
            res.render('group_manage',{groups:result,dup:false});
        });
});

router.post('/', function(req, res, next){
    console.log("check");
    var presenttime = new Date();
    var present = presenttime.toFormat("YYYY-MM-DD HH24:MI:SS");
    console.log(present);
    var groupname = req.body.groupname;
    connection.query('INSERT INTO seuksak.Group (create_date, groupname) VALUES (?, ?)',[present, groupname], function(err){
        if(err){
            res.render('group_manage',{groups:_result,dup:true});
        }else{
            res.redirect('/group');
        }
    });
});

router.get('/:id',function(req,res,next){
    var id = parseInt(req.params.id);

    connection.query('SELECT * FROM seuksak.Group WHERE id = ?',
        [id],function(error,result){
            if(error){
                console.log(error);
            }

            res.render('group_detail',{info:result[0]});
        });
});

module.exports = router;