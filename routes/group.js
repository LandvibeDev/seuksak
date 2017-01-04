/**
 * Created by lso on 17. 1. 1.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var connection = require('./connection');
var date = require('date-utils');
var group_member_list;

var node_git = require("nodegit"); // nodegit을 사용하여 깃소스 관리
var multipart = require('connect-multiparty');   // file 업로드 관련
var multipart_middle_ware = multipart();
var fs = require('fs');
var app = express();

var exec = require('child_process').exec; // child-process를 사용, 프로그램 실행
// 그룹 리스트 조회
router.get('/', function(request, response, next) {
    connection.query('SELECT G.*' +
        'FROM seuksak.GroupMember as GM JOIN seuksak.Group as G ' +
        'ON GM.group_id = G.id ' +
        'WHERE user_id = ?',
        [request.user.id],function(error,result){
            if(error){
                console.log(error);
            }
            var group_member_list = result;
            response.render('index',{group_member_list:group_member_list, dup:false, child_page:"group_manage.ejs"});
        });
});

// 그룹 인스턴스 생성
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

// 그룹 인스턴스 조회
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

// 그룹/프로젝트 리스트 조회
router.get('/:group_id/project', function (request, response, next) {
    var group_id = parseInt(request.params.group_id);

    connection.query('SELECT P.*' +
                    'FROM seuksak.Project as P JOIN seuksak.Group as G ' +
                    'ON P.group_id = G.id ' +
                    'WHERE G.id = ?',
    [group_id],
    function(error, result){
        if(error){
            console.log(error);
            throw error;
        }
        var project_group_list = result; // project_manage.ejs forEach 에 사용시에는 result[0] 말고 result
        response.render('index',{project_group_list:project_group_list, child_page:"project_manage.ejs"});
    });
});

// 그룹/프로젝트 인스턴스 생성
var mid = multipart({uploadDir: '../tmp' });
router.post('/:group_id/project', mid, function (request, response, next){
    console.log('0000000000000000000');
    var git_url = request.body.git_url;
    console.log('11111111111111111111111');
    var project_name = request.body.project_name;
    console.log('222222222222222222222222');
    console.log(request.body);
    console.log(request.files);
   // var make_file = request.files.make_file;
    console.log('33333333333333333333');
   // multipart({});
    var make_file_path;
    var group_id = parseInt(request.params.group_id);
    var present_time = new Date();
    var datetime = present_time.toFormat("YYYY-MM-DD HH24:MI:SS");
    var project_id = 0;
    var clone_options = {};
    var local_path = "../seuksak_workspace/";
    var make_file = request.files.make_file;
    clone_options.fetchOpts = {
        callbacks: {certificateCheck: function() { return 1;} }
    };
    //clone_repository.checkoutBranch('dev');
    /*
     clone_repository.getBranch('refs/remotes/origin/' + 'dev')
     .then(function(reference){/
     // checkout branch
     return clone_repository.checkoutRef(reference);
     })
     */
    console.log('99999999999999999');


    // project를 db에 반영
    var query_insert = connection.query('INSERT INTO Project (group_id, create_date, git_url, project_name) VALUES (?, ?, ?, ?)'
        ,[group_id, datetime, git_url, project_name]
        ,function(error, result){
            if(error){
                console.log(error); throw error;
            }
            project_id = result.insertId;
            local_path += "group/" + group_id + "/project/" + project_id + "/src/";
            //multipart({uploadDir: local_path}); // file upload 경로

            // clone
            var clone_repository = node_git.Clone(git_url, local_path, clone_options);

            // db에 반영된 row 의 project_path update
            var query_update = connection.query('UPDATE Project SET project_path = ? WHERE id = ?'
                ,[project_name, project_id]
                ,function(error, result){
                    if(error) {
                        console.log(error); throw error;
                    }
                });
            var outputpath = __dirname+'/../../seuksak_workspace/group/'+group_id+'/project/'+project_id+'/src/'+make_file.name;
            console.log('out:  '+outputpath);
            fs.rename(make_file.path,outputpath,function(error){
                response.redirect('/group/' + group_id + '/project/' + project_id);
            });

        });
    // console.log('insert id : ' + project_id); // 주의! 해당 라인은 위의 insert 쿼리수행이 끝나기전에 수행됨. 비동기.
});

// 그룹/프로젝트 인스턴스 조회
router.get('/:group_id/project/:project_id', function (request, response, next){
    var project_id = parseInt(request.params.project_id);
    var project_inst;
    var build_list;

    console.log('3333333333333333333333');

    connection.query('SELECT * FROM seuksak.Project WHERE id = ?'
        ,[project_id]
        ,function(error, result){
            if(error){
                console.log(error); throw error;
            }
            project_inst = result[0];

            // 해당 프로젝트에 속하는 빌드 목록
            connection.query('SELECT * FROM seuksak.Build WHERE id = ?'
            ,[project_id]
            ,function(error, result){
                if(error){
                    console.log(error); throw error;
                }
                    build_list = result;
                    response.render ('index',{project_inst:project_inst, build_list:build_list, child_page:"project_detail.ejs"});
                });
        }
    )
});

// 그룹/프로젝트/빌드 리스트 조회
router.get('/:group_id/project/:project_id/build', function (request, response, next) {
    var project_id = parseInt(request.params.project_id);

    connection.query('SELECT * FROM seuksak.Build WHERE project_id = ?',
        [project_id],
        function(error, result){
            if(error){
                console.log(error);
                throw error;
            }
            var build_list = result;
            response.render('index', {build_list:build_list, child_page:"build_manage.ejs"});
        });
});

// 그룹/프로젝트/빌드 인스턴스 생성
router.post('/:group_id/project/:project_id/build', function (request, response, next) {
    var group_id = parseInt(request.params.group_id);
    var project_id = parseInt(request.params.project_id);
    var present_time = new Date();
    var datetime = present_time.toFormat("YYYY-MM-DD HH24:MI:SS");
    /* 빌드 수행 */
    var path = '../seuksak_workspace/group/'+group_id+'/project/'+project_id+'/src/';
    exec('cd '+path+' && make',function(error,stdout,stderr){
        if(error){
            console.log(error);
        }
        else if(stdout){
            var query_insert = connection.query('INSERT INTO seuksak.Build ' +
                '(project_id, create_date,end_date,log,success) VALUES (?, ?, ?, ?, ?)'
                ,[project_id,present_time,present_time,stdout,1]
                ,function(error, result){
                    console.log("success");
                });

        }
        else if(stderr){
            console.log(stderr);
        }
    });

    response.redirect('/group/' + group_id + '/project/' + project_id + '/build')
});

// 그룹/프로젝트/빌드 인스턴스 조회
router.get('/:group_id/project/:project_id/build/:build_id', function(request, response, next){
    var project_id = parseInt(request.params.project_id);
    var build_id = parseInt(request.params.build_id);

    connection.query('SELECT * FROM seuksak.Build WHERE id = ?'
    ,[build_id]
    ,function(error, result){
            if(error){
                console.log(error); throw error;
            }
            var build_inst = result[0];
            response.render('index', {build_inst:build_inst, child_page:"build_detail.ejs"});
        });
});


module.exports = router;