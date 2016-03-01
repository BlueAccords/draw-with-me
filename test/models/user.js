// jshint esversion: 6
var chai   = require('chai'),
sinon  = require('sinon'),
expect = chai.expect,
should = chai.should();

var mongoose = require('mongoose');
var utils = require('../utils');
var User = require('../../models/user');
var Studio = require('../../models/studio');

// convert to objectID from string
// mongoose.Types.ObjectId(stringId);

// generate new objectID.
// id =  mongoose.Types.ObjectId();

describe('User Methods', function() {
  beforeEach(function(done) {
    function clearDB() {
      for(var i in mongoose.connection.collections) {
        mongoose.connection.collections[i]
        .remove(function(){});
      }
      return done();
    }

    clearDB();
  });

  describe('#create', function() {
    it('should create a new User', function(done) {
      // create a new user to pass to create
      var user = {
        local: {
          username: 'Shinobu',
          email: 'merumeru@mail.com',
          password: 'foobar'
        }
      };

      User.create(user, function(err, result) {
        should.not.exist(err);

        result.local.username.should.equal('Shinobu');
        result.local.email.should.equal('merumeru@mail.com');
        result.local.password.should.equal('foobar');

        done();
      });
    });
  });

  describe('#save', function() {
    it('should save a user with valid arguments', function(done) {
      var user = {
        local: {
          username: 'Shinobu',
          email: 'merumeru@mail.com',
          password: 'foobar'
        }
      };

      var newUser = new User(user);

      newUser.save(function(err, result) {
        should.not.exist(err);
        result.local.username.should.equal('Shinobu');
        result.local.email.should.equal('merumeru@mail.com');
        result.local.password.should.equal('foobar');

        done();
      });
    });

    it('should NOT save a user with duplicate USERNAME', function(done) {
      var user1 = {
        local: {
          username: 'Hatchikuji',
          email: 'snailmail@mailer.com',
        }
      };

      var user2 = {
        local: {
          username: 'Hatchikuji',
          email: 'thesecond@mail.com',
        }
      };

      var user1Saved = new User(user1);
      user1Saved.save(function(err, result) {
        should.not.exist(err);

        user2Saved = new User(user2);
        user2Saved.save(function(err, result) {
          should.exist(err);
          should.not.exist(result);
          err.code.should.equal(11000);

          done();
        });
      });
    });

    it('should NOT save a user with duplicate EMAIL', function(done) {
      var user1 = {
        local: {
          username: 'Hatchikuji',
          email: 'snailmail@mailer.com',
        }
      };

      var user2 = {
        local: {
          username: 'Senjou',
          email: 'snailmail@mailer.com',
        }
      };

      var user1Saved = new User(user1);
      user1Saved.save(function(err, result) {
        should.not.exist(err);

        user2Saved = new User(user2);
        user2Saved.save(function(err, result) {
          should.exist(err);
          should.not.exist(result);
          err.code.should.equal(11000);

          done();
        });
      });
    });


  });

  describe('#joinStudio', function() {
    // User should add studio to their membership list if valid
    it('should add studio to studio_memberships', function(done) {
      var user = {
        local: {
          username: 'Shinobu',
          email: 'merumeru@mail.com',
          password: 'foobar'
        }
      };

      var studio = {
        name: 'Donuts'
      };

      var newUser = new User(user);
      var newStudio = new Studio(studio);


      newUser.save(function(err, resultUser) {
        should.not.exist(err);

        newStudio.save(function(err, resultStudio) {
          should.not.exist(err);

          User.joinStudio(resultStudio, resultUser,
            function(err, finalResult) {
              should.not.exist(err);

              finalResult.ok.should.equal(1);
              finalResult.nModified.should.equal(1);
              finalResult.n.should.equal(1);

              done();
            });
          });
        });
      });

      it('should FIND added after saving a studio', function(done) {
        var user = {
          local: {
            username: 'Shinobu',
            email: 'merumeru@mail.com',
            password: 'foobar'
          }
        };

        var studio = {
          name: 'Donuts'
        };

        var newUser = new User(user);
        var newStudio = new Studio(studio);


        newUser.save(function(err, resultUser) {
          should.not.exist(err);

          newStudio.save(function(err, resultStudio) {
            should.not.exist(err);

            User.joinStudio(resultStudio, resultUser,
              function(err, resultSaved) {
                should.not.exist(err);

                User.find({}, function(err, results) {
                  // console.log('RESULTING =========================');
                  // console.log(results[0].studio_memberships);

                  results[0].studio_memberships[0].studio_id.toString().should.equal(resultStudio._id.toString());
                  done();
                });
              });
            });
          });
        });


        it('should NOT allow duplicate studios to membership list', function(done) {

          var user = {
            local: {
              username: 'Shinobu',
              email: 'merumeru@mail.com',
              password: 'foobar'
            }
          };


          var studio = {
            name: 'Donuts'
          };

          var newUser = new User(user);
          var newStudio = new Studio(studio);

          newUser.save(function(err, resultUser) {
            should.not.exist(err);

            newStudio.save(function(err, resultStudio) {
              should.not.exist(err);

              User.joinStudio(resultStudio, resultUser, function(err, resultSavedOne) {
                should.not.exist(err);

                User.joinStudio(resultStudio, resultSavedOne, function(err, resultSavedTwo) {

                  User.find({}, function(err, results) {
                    results[0].studio_memberships.should.have.length(1);
                    results[0].studio_memberships[0].studio_id.toString().should.equal(resultStudio._id.toString());
                    done();
                  });
                });
              });
            });
          });
        });
      });

    });
