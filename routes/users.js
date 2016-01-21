var express = require('express');
var router = express.Router();

// mongoose/user model connection
var mongoose = require('mongoose');
var User = mongoose.model('user');

router.get('/register', function(req, res){
  res.render('register');
});

// registration
// creations a user from form data and
// attempts to save info to mongodb
router.post('/register', function(req, res){
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
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

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', function(req, res){
  User.findOne({ email: req.body.email},
    function checkValidUser(err, user){
      if(!user){
        res.render('login', { error: "Invalid Email/Password"});
      } else {
        if(req.body.password === user.password){
          console.log("user > " + user);
          req.session.user = user; // set cookie: session={email, password, ...}
          console.log('session cookie' + req.session.user);
          res.redirect('dashboard');
        } else {
          res.render('login', { error: "Invalid Email/Password"});
        }
      }
    });
});

router.get('/dashboard', function checkValidSession(req, res){
  if(req.session && req.session.user){
    User.findOne({email: req.session.user.email }, function(err, user){
      if(!user) {
        req.session.reset();
        req.redirect('/login');
      } else {
        res.locals.user = user;
        res.render('dashboard');
      }
    });
  } else {
    res.redirect('login');
  }
});

router.get('/logout', function(req, res){
  req.session.reset(); 
  res.redirect('/');
});


module.exports = router;
