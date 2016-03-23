// Main routes file that all the other routes files are supposed to go through.
// jshint esversion: 6

// Maybe need to set NODE_PATH to ./app/controllers ?
// require controllers
const users   = require('../controllers/users');
const photos  = require('../controllers/photos');
const studios = require('../controllers/studios');
const auth    = require('../middlewares/authorization');
// Route middelwares

const loginAuth = [auth.requiresLogin];

// requiresLogin
// function isLoggedIn(req, res, next) {
//   if(req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/');
// }


// Routes.

module.exports = function(app, passport) {

  app.route('/')
    .get(function(req, res) {
      res.render('index', { title: 'Draw With Me' });
    });

  // USER ROUTES =========================================================
  app.route('/signup')
    .get(users.signup)
    .post(users.create
    //   passport.authenticate('local-signup', {
    // successRedirect: '/dashboard',
    // failureRedirect: '/login',
    // failureFlash : true
    //   })
    );

  // login
  app.route('/login')
    .get(users.login)
    .post(passport.authenticate('local-login', {
      successRedirect: 'dashboard',
      failureRedirect: '/login',
      failureFlash: true
      })
    );

  // LOGOUT =============================================================
  app.get('/logout', users.logout);

  // USER SESSIONS ======================================================
  app.get('/dashboard', loginAuth, users.show);


  // STUDIO ROUTES ======================================================
  app.param('studioId', studios.load);
  app.get('/studios', studios.index);
  app.get('/studios/new', loginAuth, studios.new);
  app.post('/studios/new', loginAuth, studios.create);
  app.get('/studios/:studioId', studios.show);
  app.get('/studios/:studioId/edit', loginAuth, studios.edit);
  app.put('/studios/:studioId/edit', loginAuth, studios.update);
  app.delete('/studios/:studioId/delete', loginAuth, studios.destroy);

  // Adding Users to studio
  app.post('/studios/:studioId/join', loginAuth, users.join);

  // ERROR HANDLING ================================================

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  //development error handler
  //will print stacktrace
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


};
