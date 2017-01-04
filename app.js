var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var passport = require('passport'); // 로그인 세션 관리를 위해 passport를 사용, 후에 토큰으로 보안 관리도 할 예정
var engine = require('ejs-locals');

var index = require('./routes/index');
var users = require('./routes/users');
var group = require('./routes/group');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// layout 을 도와줌
app.engine('ejs', engine);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser({uploadDir:'./uploads'}));

app.use(cookieSession({
    keys: ['key'],
    cookie: {
        maxAge: 100 * 60 * 60 // 쿠키 유효기간 1시간
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/',index);
app.use('/users', users);
app.use('/group', group);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
