var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var session       = require('express-session');

// db connection
// FIXME: calling configDB.url does not work properly and gives and error.
var configDB = ('./config/database');
mongoose.connect('mongodb://localhost/test-auth');

// routes
var routes = require('./routes/index');
//var users = require('./routes/users');
var photos = require('./routes/photos');


// middleware configuration

require('./config/passport')(passport);

// view engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// ===============================================================
// MIDDLEWARE =====================================================
// =================================================================
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// USER ROLE BASED AUTH test-auth
// TODO: REFACTOR THIS LATER INTO ITS OWN FILE.
var acl = require('acl');

// using memory backend
// TODO: REFACTOR TO USE MONGODB BACkEND FOR USER ROLES
acl = new acl(new acl.memoryBackend());

acl.allow('guest', 'studios', 'view');

acl.allow('registered user', 'studios', ['create','edit', 'view', 'delete']);

acl.allow('admin', 'studios', '*');

// session setup/configuration.
// TODO: setup mongodb connection(look at express-session docs)
app.use(session({
  secret: 'lostconnectiontosteamwillreconnectshortly',
  //store: mongoconnect,
  resave: false,
  saveUninitialized: false,
}));

//passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// ===============================================================
// ROUTES =====================================================
// =================================================================
app.use('/', routes);
app.use('/photos', photos);
require('./routes/users.js')(app, passport);

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

// export to bin/www which launches the server.
module.exports = app;
