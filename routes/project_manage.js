/**
 * Created by lso on 17. 1. 1.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('project_manage');
});

module.exports = router;