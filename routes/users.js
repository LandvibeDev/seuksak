var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var client = mysql.createConnection({
    host:'seuk.cxmh2e5ane0m.ap-northeast-2.rds.amazonaws.com',
    port:'33306',
    user:'seuksak',
    password:'tmrtkr3#',
    database:'seuksak'
});

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


            /*if(user){
                res.render("project");
            }
            else{
                res.redirect("login");
            }*/
        }
    });

});

module.exports = router;
