var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require("http"); 

var redis = require("redis");



// const socket = require("socket.io");

// // ws port
// const PORT = 5000;

/**
 * REDIS TEST
 */
var redisclient = redis.createClient({
  port  :6379,
  host  :'127.0.0.1'
})

redisclient.on('connect', function () {
  console.log('Redis client succesfully');
});

redisclient.on('error', function (err) {
  console.log('Redis Client Error :  ' + err);
});
/**
 * REDIS  TEST
 */



var indexRouter = require('./routes/index');



var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* redis middleware
*/
app.use(function(req,res,next){
  req.redis = redisclient;
  next();
})
/*end
*/

app.use('/', indexRouter);


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

module.exports = { app: app};