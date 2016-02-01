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
    date_created: { type: Date, default: Date.now()}
  }],
  collections       : [{type: Schema.Types.ObjectId, ref: 'Collection'}],
  owner             : { type: Schema.Types.Object, ref: 'User'},
  members           : [{
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    join_date: {type: Date, default: Date.now()}
  }],
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
});

// methods ======================

studioSchema.methods = {

  /* finds article by id.
  * load article into session/request data.
  * @param id {ObjectId}
  * @param cb {Function}
  */
  load: function(_id, cb) {
    this.findOne({_id: _id})
      .populate('members', 'local.username')
      // TODO: choose what to populate from collections into article load.
      // most likely will be...
      //.populate('collections', '');
      .exec(cb);
  },

  // Add User to members list.
  addUser: function(user) {
    this.members.push({
      user: user._id,
      date: Date.now()
    });

    this.save(cb);
  },

  /* list members
  * @param {Object} options
  * @param {Function} cb
  */
  list: function(options, cb) {
    var critera = options.critera || {};
    var page = options.page || 0;
    var limit = options.limit || 30;

    this.find(critera)
      .populate('members', 'local.username')
      .sort({'date_created': -1}) // sort by date, oldest to newest.
      .limit(limit)
      .skip(limit * page)
      .exec(cb);
  }
  //TODO: add ability to remove users from studio in studio model.
};


// create model for users via mongoose.
module.exports = mongoose.model('Studio', studioSchema);
