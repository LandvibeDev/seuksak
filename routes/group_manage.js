/**
 * Created by lso on 17. 1. 1.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var connection = require('./connection');

/* GET home page. */
router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM GroupMember WHERE user_id = ?',
        [req.user.id],function(error,result){
            if(error){
                console.log(error);
            }
            console.log(result);
            res.render('group_manage',{groups:result});
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