var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var passport = require('passport');


require('./passport').setup();

var isAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated())
        return next();
    res.redirect('/');
};

/* GET users listing. */
router.get('/',isAuthenticated,function(req, res, next) {

    res.render('login');
});

router.post('/', passport.authenticate('local', {failureRedirect: '/users', failureFlash: true}), // 인증실패시 401 리턴, {} -> 인증 스트레티지
    function (req, res) {
        res.redirect('/');
    });

module.exports = router;
