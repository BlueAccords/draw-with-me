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
    _studio_id: { type: Schema.Types.ObjectId, ref: 'Studio' },
    join_date: { type: Date, default: Date.now()},
    _id: false
  }],
});

// Validations

userSchema.path('studio_memberships').validate(function(val) {
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


};

userSchema.statics = {
  // Allows user to join studio.
  // @param {Object} studio
  // @param {Function} cb
  joinStudio: function(studio, user, cb) {
    console.log('Joining studio ... \n\n');
    // this._studio_memberships.push({
    //   studio: studio._id,
    //   join_date: Date.now()
    // });
    //
    // var studioItem = null;
    // var counter = 0;
    // check if user is already a member of a studio.
    // this._studio_memberships.forEach(function(val){
    //   studioItem = val.studio;
    //   console.log("studio item -> \n" + studioItem);
    //   console.log(" vs ");
    //   console.log(studio._id);
    //   console.log("---------------------------------");
    //   if(studioItem.toString() == studio._id.toString()) {
    //     console.log(' Failure! i mean success! Studio not joined.!');
    //     return cb('You are already a member of that studio');
    //   }
    // });

    // TODO: use the find/elemMatch methods
    // var query =
    console.log('this should have anything ======================');
    console.log(user.studio_memberships);
    console.log('VS =================');
    console.log(studio._id);

    // this.findOne({_id: user._id}, {
    //   studio_memberships: {
    //     $elemMatch: {
    //       _studio_id: studio._id
    //     }
    //   }}, function(err, results) {
    //     console.log('FINALE ======================================= \n');
    //     console.log("error" + err);
    //     console.log(results);
    //
    //     console.log(' ********************* dupe not found *');
    //     user.studio_memberships.push({
    //       _studio_id: studio._id,
    //       join_date: Date.now()
    //     });
    //
    //
    //     user.save(cb(null, 'Success?'));

    console.log('USER ID = ' + user._id);
    this.findOne({_id: user._id}, function(err, results) {
      console.log(' RESULTS ====================');
      console.log(results);

      results.studio_memberships.push({
        _id: studio._id,
        join_date: Date.now()
      });

      results.save(cb(null, results));
    });









        // if(results) {
        //     console.log(' ********************* dupe found *');
        //     cb(null, 'Follow me!');
        //   } else {
        //     console.log(' ********************* dupe not found *');
        //     user.studio_memberships.push({
        //       _studio_id: studio._id,
        //       join_date: Date.now()
        //     });
        //
        //
        //     user.save(cb(null, 'Success?'));
        //   }
        // });
    }
};



// create model for users via mongoose.
module.exports = mongoose.model('User', userSchema);
