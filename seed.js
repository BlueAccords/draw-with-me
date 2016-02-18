var chai   = require('chai'),
sinon  = require('sinon'),
expect = chai.expect,
should = chai.should();

var mongoose = require('mongoose');
// var assert = require('assert');
var Studio = require('./models/studio');
var User = require('./models/user');

var UserSeed = require('./seeds/user');
var StudioSeed = require('./seeds/studio');

var config   = require('./config/database');
mongoose.connect(config.db.test);


// Add promise function to mongoose create.
mongoose.Model.seed = function(entities) {
  var promise = new mongoose.Promise;
  this.create(entities, function(err) {
    if(err) { promise.reject(err); }
    else    { promise.resolve(); }
  });
  return promise;
};

userIds = UserSeed.getUserIds();
// console.log(userIds);
userData = UserSeed.generateUsers(userIds);

studioData = StudioSeed.generateStudios(userIds);

// Now, the interesting part:



after(function(done) {
  mongoose.disconnect();
  return done();
});

// Studio.collection.insertMany(data, function(err,results) {
//   assert.equal(null, err);
//   assert.equal(3, results.insertedCount);
//
//   mongoose.disconnect();
// });

before(function(done) {

  // ...

  // Reset collections
  User.remove().exec()
  .then(function() {
    return Studio.remove().exec();
  })
  // .then(function() {
  //     return WorkoutTemplate.remove().exec()
  // })

  // Seed
  .then(function() {
    return User.seed(userData);
  })
  .then(function() {
    return Studio.seed(studioData);
  })
  // .then(function() {
  //     return WorkoutTemplate.seed(
  //         require('workoutTemplates.json')); })

  // Finito!
  .then(function() {
    done();
  }, function(err) {
    return done(err);
  });

  // ...
});


describe('User and Studio data', function() {
  it('should have inserted 30 users', function(done) {
    Studio.find({}, function(err, studios) {
      if(err) return done(err);

      studios.should.have.length(30);
      done();
    });
  });
});

describe('Studio Seeds', function() {
  it('should have inserted 30 studios', function(done) {
    Studio.find({}, function(err, studios) {
      if(err) done(err);

      studios.should.have.length(30);
      done();
    });
  });

  it('should have studios', function(done) {
    Studio.find({}, function(err, studios) {
      if(err) return done(err);

      should.exist(studios);
      done();
    });
  });

  it('should have a reference to a user for the _owner field', function(done) {
    Studio.findOne({}, function(err, studio) {
      if(err) return done(err);

      should.exist(userIds.indexOf(studio._owner.toString()) > -1);
      done();
    });
  });
});
