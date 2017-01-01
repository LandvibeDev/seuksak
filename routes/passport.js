/**
 * Created by jeong on 17. 1. 1.
 */


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connection = require('./connection');


exports.setup = function () {
    /*로그인 성공시 사용자 정보를 Session에 저장한다*/
    passport.serializeUser(function (user, done) {
        done(null, user)
    });

    /*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'password', // post에서 name 인자
            passReqToCallback: true
        },
        function(req,id, password, done) {  // 위에 인자

            connection.query('SELECT * FROM User WHERE id = ? AND password = ?',
                [id,password],function(error,result){ // id와 password가 맞는지 쿼리문으로 확인
                    if(error){
                        console.log("login error");
                    }

                    var _id=null;
                    result.map(function(data,i){
                        _id = data.id;
                    });

                    if(_id){
                        var user = {id:_id}; // user id를 넘겨준다
                        return done(null,user); // 인증 성공시
                    }
                    else{
                        return done(null,false,{message:'Fail to login.'});
                    }
                });


        }
    ));
};