require('./database');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');


// routes
var routes = require('./routes/index');
var users = require('./routes/users');
var photos = require('./routes/photos');
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var User = mongoose.model('user');
var app = express();

// nunjucks config
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// =================== MIDDLEWARE ==============
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({
  cookieName: 'session',
  secret: 'awefoiwajfij230fj20fj082jf0jsf0',
  // ms/s/m/hr/days/weeks
  // session length is 1 week
  duration: 1000 * 60 * 60 * 24 * 7,
  // session extension time is 1 hour.
  activeDuration: 1000 * 60 * 60,
}));

// middleware function to check if user session data exists.
// if it does exist then find the user for the matching data.
// if matching user is found in the db then set local user info
// in the cookies for the user.
// else if no user found matching then continue with next();
app.use(function(req, res, next){
  if( req.session && req.session.user){
    User.findOne({ email: req.session.user.email }, function(err, user){
      if(user){
          req.user = user;
          delete req.user.password;
          req.session.user = req.user;
          res.locals.user = req.user;
      }
      next();
    });
  } else {
    next();
  }
});

app.use('/', routes);
app.use('/photos', photos);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
