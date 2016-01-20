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

router.post('/upload', function(req, res, next){
  var form = new formidable.IncomingForm();

  // parse the form.
  form.parse(req, function(err, fields, files){
    // 'file' = name of the input field's type file
    console.log(files);
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));
  });

  // error handling
  form.on('error', function(err){
    console.error(err);
  });

  // display progress to console.
  form.on('progress', function(bytesReceived, bytesExpected){
    var percentComplete = (bytesReceived / bytesExpected) * 100;
    console.log(percentComplete.toFixed(2));
  });

  // file upload complete handling
  form.on('end', function(fields, files){
    // location of temporary uploaded file.
    var temp_path = this.openedFiles[0].path;
    // the file name of the uploaded file.
    var file_name = this.openedFiles[0].name;
    // Location where we'll copy the uploaded file.
    var new_location = 'public/images';

    fs.copy(temp_path, new_location + file_name, function(err){
      if(err) {
        console.error(err);
      } else {
        console.log("success");
      }
    });
    // fs.readFile(temp_path, function(err, data){
    //   fs.writeFile(new_location + file_name, data, function(err){
    //     fs.unlink(temp_path, function(err){
    //       if(err){
    //         console.log(err);
    //       } else {
    //         console.log("File successfully uploaded");
    //       }
    //     });
    //   });
    // });
  });
});

// export
module.exports = router;
