var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
// http > https://nodejs.org/api/http.html
// util > https://nodejs.org/api/util.html
var path = require('path');
var multer = require('multer');

// storage
var storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, './uploads');
  },
  filename: function(req, file, callback){
    callback(null, Date.now() + '-' + file.fieldname);
  }
});

var limits = {
  fields: 1,
  // limit file upload to 10mb
  fileSize: 1024 * 1024,
  // limit number of file fields
  files: 10,
};

// TODO: ADD FILE FILTER function(see multer readme)
// check filetype before upload.
// https://github.com/expressjs/multer/issues/186

var multerOptions = {
  storage: storage,
  limits: limits,
};

// multer upload
var upload = multer(multerOptions).array('photoFile', 2);

// routes
router.get('/', function(req, res){
  res.render('photos', {title: 'Draw With Me - Photos'});
});

router.post('/upload', function(req, res){
  upload(req, res, function(err){
    console.log(req.body);
    console.log(req.files);
    if(err){
      return res.end('Error uploading File.');
    }
    res.end('File successfully uploaded');
  });
});

// export
module.exports = router;
