// load required libraries.
var mongoose = require('mongoose');
// used to generate tokens for user verification
var uuid = require('uuid');

var Schema = mongoose.Schema;
// User Token Schema
var userTokenSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  token: { type: String, required: true},
  expires_at: { type: Date, required: true, default: Date.now, expires: '1h'}
});

userTokenSchema.methods = {
  generateVerificationToken: function(done) {
    var thisToken = this;
    var token = uuid.v4();
    // thisToken.set('local.verification_token', token);
    thisToken.token = token;
    thisToken.save( function(err) {
      if (err) done(err);
      // FIXME: remove console log later
      console.log('Verification Token => ' + token);
      done(null, token);
    });

    // done();
  },
};

module.exports = mongoose.model('UserToken', userTokenSchema);
