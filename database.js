var mongoose = require('mongoose');
var Schema	 = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var exports = module.exports;
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/test-auth');

// TODO: MIGRATE DATABASE TO ACTUAL ONE LATER
// MODIFY MODELS TO FIX SPECS.
var UserSchema = new Schema({
  id: ObjectId,
  username: { type: String, unique: true},
  email: { type: String, unique: true},
  password: String,
  rooms: [Number],
  room_memberships: [Number],
  image_collection: [Number],
  friends: [Number],
  inbox: [Number],
  location: String,
});

var RoomSchema = new Schema({
  image_collection: [Number],
  owner: Number,
  moderators: [Number],
  members: [Number],
  events: [
    {title: String},
    {body: String},
    {date: Date},
  ],
  permissions: {
    type: String,
    enum: ['Public', 'Private', 'Invite Only', 'Friends Only'],
    default: 'Public'
  },
  password: String,
});

var PhotoSchema = new Schema({
  file_location: String,
  filename: String,
  file_size: Number,
  filetype: {
    type: String,
    enum: ['png', 'jpg', 'jpeg']
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: Number,
  tags: [Number],
});

var Tag = new Schema({
  name: String,
  description: String,
});

var User = mongoose.model('user', UserSchema);
var Room = mongoose.model('room', RoomSchema);
var Photo = mongoose.model('photo', PhotoSchema);

exports.createUser = function(obj){
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(obj.password, salt);

  var user = new User({
    username: obj.username,
    email: obj.email,
    password: hash,
  });

  return user.save(function(err, savedUser){
    console.log(savedUser);
    if(err){
      var error = 'Something bad happened. Try again!';
      if(err.code === 11000){
        error = 'Email is already in use. Please try another';
      }
      //res.render('register', {error: error});
      console.log('error', {error: error});
    } else {
      console.log('Succesfully created user');
      console.log(
        {
          username: user.username,
          email: user.email,
          password: user.password
        });
        return true;
    }

  });
};

// module.exports = {
//   user: User,
//   room: Room,
//   photo: Photo,
// };
