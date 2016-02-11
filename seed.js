// factory girl + mongoose factory adapter for seeding

var factoryGirl = require('factory-girl');
var Factory = new factoryGirl.Factory();
var MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;
Factory.setAdapter(MongooseAdapter);

var User    = require('./models/user');
var Studio  = require('./models/studio');

Factory.define('user', User, {
  _id: 1,
  local: {
    local             : {
      username        : 'Bobbert',
      email           : 'peacemaker@nerfed.com',
      password        : 'foobar',
    }
  }
});

Factory.define('studio', Studio, {
  name               : 'Monogatari',
  description        : 'A place for oddities',
  date_created       : Date.now(),
  comments           : [{
    body             : 'One comment here',
    user             : Factory.assoc('user', 1),
    date_created     : Date.now(),
  }],
  owner              : Factory.assoc('user', 1),
  private            : false,
});

Factory.build('user', function(err, user) {
  console.log(user.attributes);
});
