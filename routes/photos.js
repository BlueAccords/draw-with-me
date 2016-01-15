var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
// formidable used to handle file uploads.
// http > https://nodejs.org/api/http.html
// util > https://nodejs.org/api/util.html
var formidable = require('formidable');
var path = require('path');

// routes
router.get('/', function(req, res){
  res.render('photos', {title: 'Draw With Me - Photos'});
});

router.post('/upload', function(req, res){

});

// export
module.exports = router;
