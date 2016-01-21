var mongoose = require('mongoose');
var Schema	 = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var User = new Schema({
  id: ObjectId,
  username: { type: String, unique: true},
  email: { type: String, unique: true},
  password: String,
});

mongoose.model('user', User);

mongoose.connect('mongodb://localhost/test-auth');
