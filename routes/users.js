var express = require('express');
var router = express.Router();

router.get('/register', function(req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  res.json(req.body);
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
