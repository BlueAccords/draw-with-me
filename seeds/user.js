// jshint esversion: 6

var mongoose = require('mongoose');
// var utils = require('../utils');
var User = require('../models/user');
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

module.exports = {
  generateUsers: generateUsers,
  getUserIds: getUserIds
};
