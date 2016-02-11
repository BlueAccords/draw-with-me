// Utility file to clear database before tests.

var config   = require('../config/database');
var mongoose = require('mongoose');

process.env.NODE_ENV = 'test';

beforeEach(function(done) {

  function clearDB() {
    for(var i in mongoose.connection.collections) {
      mongoose.connection.collections[i]
        .remove(function(){});
    }
    return done();
  }

  if(mongoose.connection.readyState === 0) {
    mongoose.connect(config.db.test, function(err) {
      if(err) throw err;

      return clearDB();
    });
  } else {
    return clearDB();
  }
});

afterEach(function(done) {
  
  return done();
});
