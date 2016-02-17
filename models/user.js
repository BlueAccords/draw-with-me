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
    studio: { type: Schema.Types.ObjectId, ref: 'Studio' },
    join_date: { type: Date, default: Date.now()},
    _id: false
  }],
});

// Validations

userSchema.path('_studio_memberships').validate(function(val) {
  // TODO: Decide to keep this or remove user validation.
  // console.log('THIS IS THE STUDIO VALIDATION INFO ******************* V');
  // console.log(val);
  //
  // val.forEach(function(item) {
  //   if(item.studio.toString() == )
  // })
  /*
  [ { studio: 56c012a5c1a1f26c3362279c,
    _id: 56c4f4c9a5abae1d21e96642,
    join_date: Wed Feb 17 2016 14:31:37 GMT-0800 (PST) },
  { studio: 56c012a5c1a1f26c3362279c,
    _id: 56c4f4eed0f3892521ce64e7,
    join_date: Wed Feb 17 2016 14:32:14 GMT-0800 (PST) },
  { studio: 56c012a5c1a1f26c336227ac,
    _id: 56c4f5e98f8dff4b218c397e,
    join_date: Wed Feb 17 2016 14:36:25 GMT-0800 (PST) },
  { studio: 56c012a5c1a1f26c336227ae,
    _id: 56c4f63ebf4da95c21cecb77,
    join_date: Wed Feb 17 2016 14:37:50 GMT-0800 (PST) } ]
    */
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

    // this._studio_memberships.push({
    //   studio: studio._id,
    //   join_date: Date.now()
    // });

    this.update({"$addToSet": {
      "_studio_memberships": {
        "studio": studio._id,
        "join_date": Date.now(),

      }}} ,cb);
    }
};




// create model for users via mongoose.
module.exports = mongoose.model('User', userSchema);
