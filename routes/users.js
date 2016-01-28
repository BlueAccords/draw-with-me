module.exports = function(app, passport) {

// REGISTER / LOCAL SIGNUP
app.get('/register', function(req, res){
  res.render('register', { message: req.flash('signupMessage') });
});

app.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash : true
}));

// LOGIN
app.get('/login', function(req, res){
  res.render('login', { message: req.flash('loginMessage') });
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: 'dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/dashboard', isLoggedIn, function(req, res) {
  res.render('dashboard', {
    user: req.user // get user session data and pass to dashboard.
  });
});

// LOGOUT ===========================================
// should DELETE session data
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// middleware function to check if user session is valid.
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

};
