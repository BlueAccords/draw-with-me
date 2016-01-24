var mongoose = require('mongoose');
var Schema	 = mongoose.Schema;

var ObjectId = Schema.ObjectId;

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

module.exports = {
  user: User,
  room: Room,
  photo: Photo,
};
