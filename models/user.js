// load required libraries.
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

var Schema = mongoose.Schema;
// User Schema
var userSchema = new Schema({
  local             : {
    username        : { type: String, unique: true, trim: true },
    email           : { type: String, unique: true, lowercase: true, trim: true },
    password        : String,
    verification_token: { type: String},
    token_date      : { type: Date, default: Date.now, expires: '1h' },
    verified        : { type: Boolean, default: false },
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
  studio_memberships : [{
    studio_id: {type: Schema.Types.ObjectId, ref: 'Studio'},
    join_date: {type: Date, default: Date.now()}
  }],
});

// Validations

userSchema.path('studio_memberships').validate(function(val) {
  // console.log('VALIDATOR ==========================');
  // // console.log(val);
  // var sortedArr = val.slice();
  // sortedArr.sort();
  //
  // var i;
  // for (i = 1; i < sortedArr.length; ++i) {
  //   console.log(sortedArr[i]._id);
  //   console.log('VS');
  //   console.log(sortedArr[i-1]._id);
  //   console.log('');
  //   if(sortedArr[i]._id === sortedArr[i-1]._id){
  //     return false;
  //   }
  // }
  return true;
}, 'Duplicate found');

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

};

userSchema.statics = {
  // Allows user to join studio.
  // @param {Object} studio
  // @param {Function} cb
  joinStudio: function(studio, user, cb) {
    console.log('Joining studio ... \n\n');


    //IDEA: Refactor this to use validator + async module.
    // STABLE ============================================

    // console.log('USER ID = ' + user._id);
    // this.findOne({_id: user._id}, function(err, results) {
    //   console.log(' RESULTS ====================');
    //   console.log(results);
    //
    //   results.studio_memberships.push({
    //     _id: studio._id,
    //     join_date: Date.now()
    //   });
    //
    //   results.save(cb(null, results));
    // });

    var studioObject = {
      studio_id : studio._id,
      join_date: Date.now()
    };

    this.update(
    {_id: user._id, 'studio_memberships.studio_id': {$ne: studioObject.studio_id}},
    {$push: {'studio_memberships': studioObject}},
    function(err, results) {
      cb(null, results);
    });
    }
};



// create model for users via mongoose.
module.exports = mongoose.model('User', userSchema);
