// jshint esversion: 6
var chai   = require('chai'),
sinon  = require('sinon'),
expect = chai.expect,
should = chai.should();

var mongoose = require('mongoose');
var utils = require('../utils');
var User = require('../../models/user');

describe('userToken model', function() {
  describe('#generateVerificationToken', function() {
    it('should generate a token upon user save.', function(done) {
      var user = {
        local: {
          username: 'Shinobu',
          email: 'merumeru@mail.com',
          password: 'foobar'
        }
      };

      var newUser = new User(user);

      newUser.save(function(err, resultUser) {
        resultUser.local.verified.should.equal(false);
        resultUser.local.token_date.should.exist;
        resultUser.local.token_date.should.exist;
        console.log(resultUser);
        done();
      });
    });
  });
});
