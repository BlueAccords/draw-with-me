// load required libraries.
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');
var Schema = mongoose.Schema;
// User Schema
var userSchema = new Schema({
  local             : {
    username        : String,
    email           : String,
    password        : String,
  },
  facebook          : {
    id              : String,
    token           : String,
    email           : String,
    name            : String,
  },
  twitter           : {
    id              : String,
    token           : String,
    displayName     : String,
    username        : String,
  },
  google            : {
    id              : String,
    token           : String,
    email           : String,
    name            : String,
  }
});

// methods ======================
// genereate hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// validate password
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};



// create model for users via mongoose.
module.exports = mongoose.model('User', userSchema);
