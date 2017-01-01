var express = require('express');
var router = express.Router();

/* GET home page. */

<<<<<<< HEAD
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/users');
};

router.get('/',isAuthenticated, function(req, res, next) {

  console.log(req.user);
=======
  res.render('index');
>>>>>>> 971e3f680e890a0741c2e629afdcb95ed721f77e
});

router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/');
});
module.exports = router;
