// jshint esversion: 6
var chai   = require('chai'),
    sinon  = require('sinon'),
    expect = chai.expect,
    should = chai.should();

var faker = require('faker');
var mongoose = require('mongoose');
var utils = require('../utils');
var Studio = require('../../models/studio');
var User = require('../../models/user');
// convert to objectID from string
// mongoose.Types.ObjectId(stringId);

// generate new objectID.

var id_1 = mongoose.Types.ObjectId();




// For loop to generate and add random studios to an array.
function generateStudios(){
  var studioSeeds = [];
  for(var i = 0; i < 20; i++) {
    var studioDocument = {
      name               : faker.company.companyName(),
      description        : faker.lorem.paragraph(),
      date_created       : faker.date.recent(),
      comments           : [{
        body             : faker.lorem.sentences(),
        user             : getRandomUser(),
        date_created     : faker.date.recent(),
      }],
      owner              : getRandomUser(),
      private            : false,
    }
    studioSeeds.push(studioDocument);
  }
  return studioSeeds;
}

// function to get random user from database and return user.
function getRandomUser() {
  User.count().exec(function(err, count){

  var random = Math.floor(Math.random() * count);

  User.findOne().skip(random).exec(
    function (err, result) {
      return result._id;
      // result is random
  });
});
}


describe('studio database testing', function() {
  it('insertMany should be ran once', function() {
    seeds = generateStudios();
    sinon.spy(Studio, 'insertMany');
    Studio.insertMany(seeds, onInsert);
    Studio.insertMany.called.should.be.true;
    mongoose.disconnect();
  });

});


function onInsert(err, docs){
  if (err) {
    console.log(err);
  } else {
    console.error('Studio were successfully stored', docs.count());
  }
}
