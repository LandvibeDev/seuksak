/**
 * Created by lso on 17. 1. 1.
 */
var express = require('express');
var router = express.Router();
var connection = require('./connection'); // db connection 모듈을 불러온다.
var node_git = require("nodegit");        // nodegit 모듈
var date = require('date-utils');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('project_add');
});


router.post('/', function(req, res, next){
    var git_url = req.body.git_url; // "https://github.com/LandvibeDev/seuksak/"
    var project_name = req.body.project_name;
    var present_time = new Date();
    var datetime = present_time.toFormat("YYYYMMDD HH24MISS");
    var query_datetime = 'STR_TO_DATE(\'' + datetime +'\', \'%Y%m%d %H:%i:%s\'';

    // git_url 에 있는 프로젝트를 clone
    // group_id, project_id 반영 필요
    // clone 할 project 에 대해 중복 검사 필요
    // var local_path = "../seuksak_workspace/group/1/project/1/src/";
    var local_path = "../seuksak_workspace/group/1/project/2/src/";

    var clone_options = {};
    clone_options.fetchOpts = {
        callbacks: {
            certificateCheck: function() { return 1;}
        }
    };

    var clone_repository = node_git.Clone(git_url, local_path, clone_options);

    //clone_repository.checkoutBranch('dev');
    /*
    clone_repository.getBranch('refs/remotes/origin/' + 'dev')
        .then(function(reference){
            // checkout branch
            return clone_repository.checkoutRef(reference);
        })
    */
    // clone 후 db에 반영
    var query = connection.query('INSERT INTO Project (group_id, git_url, project_name, create_date) VALUES (?, ?, ?, ?)'
        ,[1, git_url, project_name, query_datetime]
        ,function(error, result){
            if(error){
               console.log(error);
               throw error;
            }
            console.log(query);
        });

   // res.render('project_manage');
    res.redirect('/projectAdd')
});

module.exports = router;