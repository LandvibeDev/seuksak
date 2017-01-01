var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/',function(req,res,next){
    var id = req.body.id;
    var password = req.body.password;

    client.query('SELECT * FROM User',function(error,result,fields){
        if(error){
            console.log(error);
        }
        else{
            var check = false;
            console.log(id,password);
            result.map(function(data,i){
                console.log(data.id,data.password);
                if(data.id == id && data.password == password){
                   check =true;
                }
            });
            if(check){
                res.redirect('/');
            }else {
                res.redirect('/users');
            }
        }
    });

});

module.exports = router;
