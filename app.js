var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var index = require('./routes/index');
var users = require('./routes/users');
// build
var build_detail = require('./routes/build_detail');
var build_manage = require('./routes/build_manage');
// group
var group_detail = require('./routes/group_detail');
var group_manage = require('./routes/group_manage');
var group_add = require('./routes/group_add');
// project
var project_detail = require('./routes/project_detail');
var project_manage = require('./routes/project_manage');
var project_add = require('./routes/project_add');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
// build
app.use('/buildDetail', build_detail);
app.use('/buildManage', build_manage);
// group
app.use('/groupDetail', group_detail);
app.use('/groupManage', group_manage);
app.use('/groupAdd', group_add);
// project
app.use('/projectDetail', project_detail);
app.use('/projectManage', project_manage);
app.use('/projectAdd', project_add);

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
