var express = require('express');
var router = express.Router();

/* GET home page. */

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/users');
};

router.get('/',isAuthenticated, function(req, res, next) {

  console.log(req.user);
  res.render('project');
});

router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/');
});
module.exports = router;
