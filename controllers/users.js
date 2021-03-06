
// module dependencies

var mongoose = require('mongoose');
var User = mongoose.model('User');

// create User
// IDEA: refactor create user to get it out of passport local strategy.

// show dashboard/user profile
exports.show = function(req, res) {
  res.render('dashboard', {
    user: req.user // get user session data and pass to dashboard.
  });
};

// show login form
exports.login = function(req, res) {
  res.render('login', {
    message: req.flash('loginMessage')
  });
};

// signup form
exports.signup = function(req, res){
  res.render('signup', {
    message: req.flash('signupMessage')
  });
};

// logout
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};


// *** User joining of studios ***********************************

exports.join = function(req, res) {
  var studio = req.studio;
  var user = req.user;

  // FIXME: refactor this to use the static method instead of the user specific method.
  User.joinStudio(studio, user, function(err) {
    if(err) {
      req.flash('error', 'You are already a member of this studio!');
    } else {
      req.flash('success', 'Successfully joined studio');
    }
    res.redirect('/studios/' + studio.id);
  });
};
