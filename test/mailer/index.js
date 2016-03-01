// jshint esversion: 6
var chai   = require('chai'),
sinon  = require('sinon'),
expect = chai.expect,
should = chai.should();
var utils = require('../utils');
var mailer = require('../../mailer/index');

describe.only('Mailer', function() {


    describe('#sendOne()', function(done) {

      it('should render email activation template correctly', function(done) {
        var locals = {
          email: 'one@example.com',
          subject: 'Draw With Me - Account Confirmation',
          name: 'Narcissus',
          resetUrl: 'http://localhost:3000/password_rest/000000000001|afdaevdae353'
        };

        mailer.sendOne('verify_account', locals, function(err, responseStatus, html, text) {
          should.not.exist(err);
          responseStatus.should.include("OK");
          text.should.include("Please follow this link to reset your password " + locals.resetUrl);
          html.should.include("Please follow this link to reset your password <a href=\"" + locals.resetUrl + "\">" + locals.resetUrl + "</a>");
          done();
      });
      });

    });


});
