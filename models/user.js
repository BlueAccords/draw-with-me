// load required libraries.
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');
var Schema = mongoose.Schema;
// User Schema
var userSchema = new Schema({
  local             : {
    username        : String,
    email           : { type: String, lowercase: true },
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
  },
  _studio_memberships : [{
    studio: { type: Schema.Types.objectId, ref: 'Studio' },
    join_date: { type: Date, default: Date.now()}
  }],
});

// Validations

userSchema.path('_student_memberships').validate(function(val) {
  console.log(val);
  return true;
});

// methods ======================

userSchema.methods = {
  // genereate hash
  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  // validate password
  validPassword: function(password) {
    return bcrypt.compareSync(password, this.local.password);
  },

  // Allows user to join studio.
  joinStudio: function(studio, cb) {

    this._studio_memberships.push({
      studio: studio._id,
      join_date: Date.now()
    });

    this.save(cb);
  }
};




// create model for users via mongoose.
module.exports = mongoose.model('User', userSchema);
