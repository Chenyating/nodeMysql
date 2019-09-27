var createError = require('http-errors');
var express = require('express');
var path = require('path');//路径操作模块

// 在express这个框架中，默认不支持session，cookie。，可使用express-ssion来解决
// 一、安装npm install express-ssion
// 二、配置一定要在router之前；
// 三、使用这个插件配置哈后，可以通过req.session来发访问和设置成员，

var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var articleRouter = require('./routes/article');
var messageRouter = require('./routes/message');
var projectRouter = require('./routes/project');
var timesRouter = require('./routes/times');
var uploadRouter = require('./routes/upload');
var personRouter = require('./routes/person');
// ai组的
var aiSpendRouter = require('./routes/ai/selectAiSpend.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 开放资源
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/article', articleRouter);
app.use('/project', projectRouter);
app.use('/message', messageRouter);
app.use('/times', timesRouter);
app.use('/upload', uploadRouter);
app.use('/person', personRouter);
// ai组的
app.use('/aiSpend', aiSpendRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
