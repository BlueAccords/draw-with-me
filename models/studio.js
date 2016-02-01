// load required libraries.
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

var Schema = mongoose.Schema;

// Studio schema
var studioSchema = new Schema({
  name: { type: String, default: '', trim: true },
  local             : {
    username        : String,
    email           : String,
    password        : String,
  },
  description: { type: String,
              default: 'A studio for artists to colloaborate together',
              trim: true
            },
  date_created: {type: Date, default: Date.now()},
  comments : [{
    body: { type: String, default: ''},
    user: { type: Schema.ObjectId, ref: 'User'},
    date_created: { type: Date, default: Date.non}
  }],
  collections       : [{type: Schema.Types.ObjectId, ref: 'Collection'}],
  owner             : { type: Schema.Types.Object, ref: 'User'},
  members           : [{type: Schema.Types.ObjectId, ref: 'User'}],
  private           : {type: Boolean, default: false},
});

/*
* Validations ===========================================================
*/

studioSchema.path('name').required(true, 'Studio room name cannnot be blank');

/*
* Pre Hooks
* Functions to be ran BEFORE a certain action is taken.
* i.e before removing, saving creating, ect.
*/
studioSchema.pre('remove', function(next) {
  // TODO: delete collections dependent on the studio.
  console.log("TODO: delete dependent collections.");
});

// methods ======================

studioSchema.methods = {

  /*
  * Save Studio object.
  *
  *
  */
};


// create model for users via mongoose.
module.exports = mongoose.model('Studio', userSchema);
