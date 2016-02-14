// jshint esversion: 6
var chai   = require('chai'),
    sinon  = require('sinon'),
    expect = chai.expect,
    should = chai.should();

var mongoose = require('mongoose');
// var utils = require('../utils');
var User = require('../../models/user');
var faker = require('faker');

// convert to objectID from string
// mongoose.Types.ObjectId(stringId);

// generate new objectID.
// id =  mongoose.Types.ObjectId();


// Generate users and return an array of users in json format.
// accepts a geneated list of ids(that can be used by other, dependent models)
function generateUsers(idArr){
  var userSeeds = [];
  // idArr = getUserIds();
  // console.log(idArr);
  // console.log(new mongoose.Types.ObjectId());
  for(var i = 0; i < idArr.length; i++) {
    var user =
    {
      _id: idArr[i],
      local             : {
        username        : faker.internet.userName(),
        email           : faker.internet.email(),
        password        : faker.internet.password()
      }
    }

    userSeeds.push(user);
  }
  return userSeeds;
}

// get the seeded users ids.
function getUserIds(arr) {
  idArray = [];
  for (var i = 0; i < 30; i++) {
    idArray.push(new mongoose.Types.ObjectId());
  }
  return idArray;
}
// describe('user database seeding', function() {
//   it('should have inserted 30 users', function() {
    // seeds = generateUsers();
    // // sinon.spy(User, 'insertMany');
    // User.insertMany(seeds, onInsert);
    // User.insertMany.called.should.be.true;
//   });
//
// });


function onInsert(err, docs){
  if (err) {
    console.log(err);
  } else {
    console.error('Users were successfully stored', docs.count());
  }
}

module.exports = {
  generateUsers: generateUsers,
  getUserIds: getUserIds
};
