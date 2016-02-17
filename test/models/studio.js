// jshint esversion: 6
var chai   = require('chai'),
sinon  = require('sinon'),
expect = chai.expect,
should = chai.should();

var faker = require('faker');
var mongoose = require('mongoose');
// var utils = require('../utils');
var Studio = require('../../models/studio');
var User = require('../../models/user');
// convert to objectID from string
// mongoose.Types.ObjectId(stringId);

// generate new objectId.
//
// var id_1 = mongoose.Types.ObjectId();

var config   = require('../../config/database');

function generateStudios(userIds) {
  var studios = [];

  for(var i = 0; i < userIds.length; i++) {

    // get random num for user
    var random = Math.floor(Math.random() * userIds.length);

    studio =
    {
      name               : faker.company.companyName(),
      description        : faker.lorem.paragraph(),
      date_created       : faker.date.recent(),
      comments           : [{
        body             : faker.lorem.sentences(),
        user             : mongoose.Types.ObjectId(userIds[random]),
        date_created     : faker.date.recent(),
      }],
      _owner              : mongoose.Types.ObjectId(userIds[i]),
      private            : false,
    };
    studios.push(studio);
  }
  // console.log(studios[0]);
  return studios;
}

module.exports = {
  generateStudios: generateStudios
};
