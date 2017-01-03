/**
 * Created by lso on 17. 1. 1.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var connection = require('./connection');
var date = require('date-utils');
var node_git = require("nodegit");        // nodegit 모듈

var group_member_list;

router.get('/', function(request, response, next) {
    connection.query('SELECT * FROM GroupMember WHERE user_id = ?',
        [request.user.id],function(error,result){
            if(error){
                console.log(error);
            }
            console.log(result);
            group_member_list = result;
            response.render('index',{group_member_list:group_member_list, dup:false, child_page:"group_manage.ejs"});
        });
});
router.post('/', function(request, response, next){
    var presenttime = new Date();
    var present = presenttime.toFormat("YYYY-MM-DD HH24:MI:SS");
    var groupname = request.body.groupname;
    connection.query('INSERT INTO seuksak.Group (create_date, groupname) VALUES (?, ?)',[present, groupname],
        function(err,result){
        if(err){

            response.redirect('/group');
        }else{
            connection.query('INSERT INTO seuksak.GroupMember (user_id, group_id) VALUES (?, ?)',
                [request.user.id,result.insertId],function(error,result){
                    if(error){
                        console.log(error);
                    }else{}
                    response.redirect('/group');
                });

        }
    });
});

router.get('/:group_id',function(request, response, next){
    var group_id = parseInt(request.params.group_id);

    connection.query('SELECT * FROM seuksak.Group WHERE id = ?',
        [group_id],function(error,result){
            if(error){
                console.log(error);
            }
            var group_inst = result[0];
            response.render('index',{info:result[0], group_inst:group_inst, child_page:"group_detail.ejs"});
        });
});

// 특정 그룹에 대한 프로젝트 관리
router.get('/:group_id/project', function (request, response, next) {
    var group_id = parseInt(request.params.group_id);

    connection.query('SELECT * ' +
                    'FROM seuksak.Project as P JOIN seuksak.Group as G ' +
                    'ON P.group_id = G.id ' +
                    'WHERE G.id = ?',
    [group_id],
    function(error, result){
        if(error){
            console.log(error);
            throw error;
        }
        console.log(result);
        var project_group_list = result; // project_manage.ejs forEach 에 사용시에는 result[0] 말고 result


        response.render('index',{project_group_list:project_group_list, child_page:"project_manage.ejs"});
    });


});

// 특정 그룹에 대한 프로젝트 생성
router.post('/:group_id/project', function (request, response, next){
    var git_url = request.body.git_url;
    var project_name = request.body.project_name;
    var group_id = parseInt(request.params.group_id);
    var present_time = new Date();
    var datetime = present_time.toFormat("YYYY-MM-DD HH24:MI:SS");
    var project_id = 0;
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
     .then(function(reference){/
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
            project_id = result.insertId;
            local_path += "group/" + group_id + "/project/" + project_id + "/src/";

            // clone
            var clone_repository = node_git.Clone(git_url, local_path, clone_options);

            // db에 반영된 row 의 project_path update
            var query_update = connection.query('UPDATE Project SET project_path = ? WHERE id = ?'
                ,[local_path, project_id]
                ,function(error, result){
                    if(error) {
                        console.log(error);
                        throw error;
                    }
                });
            //response.render ('index',{info:result[0], group_inst:group_inst, child_page:"project_detail.ejs"});
           response.redirect('/group/' + group_id + '/project/' + project_id);
        });

    // console.log('insert id : ' + project_id); // 주의! 해당 라인은 위의 insert 쿼리수행이 끝나기전에 수행됨. 비동기.

});

// 특정 그룹의 특정 프로젝트
router.get('/:group_id/project/:project_id', function (request, response, next){
    var project_id = parseInt(request.params.project_id);
    var project_inst;

    connection.query('SELECT * FROM seuksak.Project WHERE id = ?'
        ,[project_id]
        ,function(error, result){
            if(error){
                console.log(error);
                throw error;
            }
            project_inst = result[0];
            response.render ('index',{info:result[0], project_inst:project_inst, child_page:"project_detail.ejs"});
        }
    )


});

module.exports = router;