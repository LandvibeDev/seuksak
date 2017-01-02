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
    var git_url = req.body.git_url;
    var project_name = req.body.project_name;
    var group_id = req.body.group_id;
    var present_time = new Date();
    var datetime = present_time.toFormat("YYYY-MM-DD HH24:MI:SS");
    var insert_id = 0;
    var clone_options = {};
    clone_options.fetchOpts = {
        callbacks: {
            certificateCheck: function() { return 1;}
        }
    };
    // git_url 에 있는 프로젝트를 clone
    /* clone 할 project 에 대해 중복 검사 필요, group_id 반영 필요 */
    var local_path = "../seuksak_workspace/";

    //clone_repository.checkoutBranch('dev');
    /*
    clone_repository.getBranch('refs/remotes/origin/' + 'dev')
        .then(function(reference){
            // checkout branch
            return clone_repository.checkoutRef(reference);
        })
    */

    // project를 db에 반영
    var query_insert = connection.query('INSERT INTO Project (group_id, git_url, project_name, create_date) VALUES (?, ?, ?, ?)'
        ,[group_id, git_url, project_name, datetime]
        ,function(error, result){
            if(error){
               console.log(error);
               throw error;
            }
            // console.log(query);
            insert_id = result.insertId;
            local_path += "group/" + group_id + "/project/" + insert_id + "/src/";

            // clone
            var clone_repository = node_git.Clone(git_url, local_path, clone_options);

            // db에 반영된 row 의 project_path update
            var query_update = connection.query('UPDATE Project SET project_path = ? WHERE id = ?'
                ,[local_path, insert_id]
                ,function(error, result){
                    if(error) {
                        console.log(error);
                        throw error;
                    }
                });

        });

    // console.log('insert id : ' + insert_id); // 주의! 해당 라인은 위의 insert 쿼리수행이 끝나기전에 수행됨. 비동기.
    // res.render('project_manage');
    res.redirect('/projectAdd')
});

module.exports = router;