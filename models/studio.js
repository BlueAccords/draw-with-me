// load required libraries.
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

var Schema = mongoose.Schema;

// Studio schema
// TODO: add slug route based on name. https://github.com/larvit/larvitslugify
var studioSchema = new Schema({
  name               : { type: String, default: '', trim: true },
  description        : { type: String,
              default: 'A studio for artists to colloaborate together',
              trim   : true
            },
  date_created       : {type: Date, default: Date.now()},
  comments           : [{
    body             : { type: String, default: ''},
    user             : { type: Schema.Types.ObjectId, ref: 'User'},
    date_created     : { type: Date, default: Date.now()}
  }],
  collections        : [{type: Schema.Types.ObjectId, ref: 'Collection'}],
  _owner              : { type: Schema.Types.ObjectId, ref: 'User'},
  _members            : [{
    user             : {type: Schema.Types.ObjectId, ref: 'User'},
    join_date        : {type: Date, default: Date.now()}
  }],
  private            : {type: Boolean, default: false},
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
  // TODO: remove images(once images are implemented) from the studio.
});

// methods ======================

studioSchema.methods = {


  // Create Studio and save to the db.
  // TODO: add image uploading capability to the studio creation process.
  // TODO: automatically create a default collection upon studio creation.
  // @param images {Object} is currently not used.
  createAndSave: function(images, cb) {
    var self = this;

    this.validate(function(err) {
      if(err) return cb(err);
      self.save(cb);
    });
  },

  // Add User to members list.
  addUser: function(user) {
    this.members.push({
      user: user._id,
      date: Date.now()
    });

    this.save(cb);
  },




  //TODO: add ability to remove users from studio in studio model.
};

// static methods
studioSchema.statics = {
  /* finds studio by id.
  * load studio into session/request data.
  * @param id {ObjectId}
  * @param cb {Function}
  */
  load: function(id, cb) {
    this.findOne({_id: id})
      .populate('_members _owner',
        'local.username local.email')
      // TODO: choose what to populate from collections into studio load.
      // most likely will be...
      //.populate('collections', '');
      .exec(cb);
  },

  /* list members
  * @param {Object} options
  * @param {Function} cb
  */
  list: function(options, cb) {
    var critera = options.critera || {};
    var page = options.page || 0;
    var limit = options.limit || 30;

    // FIXME: find out how to populate nested sub documents later.
    this.find(critera)
      .populate('_members _owner',
        'local.username local.email')
      .sort({'date_created': -1}) // sort by date, oldest to newest.
      .limit(limit)
      .skip(limit * page)
      .exec(cb);
  }
};


// create model for users via mongoose.
module.exports = mongoose.model('Studio', studioSchema);
