// TODO: REFACTOR THIS ROUTE BETTER.
// TODO: passport or drywall(skeleton of passport)
var express = require('express');
var router = express.Router();

// mongoose/user model connection
var mongoose = require('mongoose');
var User = mongoose.model('user');
var bcrypt = require('bcryptjs');

// CSRF token passed into template.
router.get('/register', function(req, res){
  res.render('register', { csrfToken: req.csrfToken()});
});

// middleware function to authenticate session data.
//
function requireLogin(req, res, next){
  if(!req.user){
    res.redirect('login');
  } else {
    next();
  }
}

// registration
// creations a user from form data and
// attempts to save info to mongodb
// TODO: LOOk INTO MORE OPTIONS(MORE CYCLES?)
// LONGER SALT?
router.post('/register', function(req, res){
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);

  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hash,
  });

  user.save(function(err, savedUser){
    console.log(savedUser);
    if(err){
      var error = 'Something bad happened. Try again!';
      if(err.code === 11000){
        error = 'Email is already in use. Please try another';
      }
      res.render('register', {error: error});
    } else {
      res.redirect('/dashboard');
    }
  });
});

// login page
router.get('/login', function(req, res){
  res.render('login', {csrfToken: req.csrfToken()});
});

// post login info
router.post('/login', function(req, res){
  User.findOne({ email: req.body.email},
    function checkValidUser(err, user){
      if(!user){
        res.render('login', { error: "Invalid Email/Password"});
      } else {
        if(bcrypt.compareSync(req.body.password, user.password)){
          req.session.user = user; // set cookie: session={email, password, ...}
          console.log("Login Successful?");
          res.redirect('dashboard');
        } else {
          res.render('login', { error: "Invalid Email/Password"});
        }
      }
    });
});

// runs requireLogin which will either go to the next middleware or
// allower the user to access the dashboard
router.get('/dashboard', requireLogin, function checkValidSession(req, res){
    res.render('dashboard');
});

router.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/');
});

router.get('profile', function(req, res){
  res.send('aaaprofile');
});

module.exports = router;
