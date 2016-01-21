var express = require('express');
var router = express.Router();

// mongoose/user model connection
var mongoose = require('mongoose');
var User = mongoose.model('user');

router.get('/register', function(req, res){
  res.render('register');
});

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

router.get('/dashboard', function(req, res){
  res.render('dashboard');
});

router.get('/logout', function(req, res){
  res.redirect('/');
});


module.exports = router;
