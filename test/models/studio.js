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




// For loop to generate and add random studios to an array.
// function generateStudios(n){
//   var studioSeeds = [];
//   while (studioSeeds.length < n) {
//     studioSeeds.push(new Promise(resolve, reject){
//       getRandomUser().then(function(userId) {
//         resolve({
//           name               : faker.company.companyName(),
//           description        : faker.lorem.paragraph(),
//           date_created       : faker.date.recent(),
//           comments           : [{
//             body             : faker.lorem.sentences(),
//             user             : userId,
//             date_created     : faker.date.recent(),
//           }],
//           owner              : userId,
//           private            : false,
//         });
//       });
//
//     });
//   }
//   return studioSeeds;
// }

// function to get random user from database and return user.
function getRandomUser() {
  return new Promise( function (resolve, reject) {
    User.count().exec(function(err, count){
      var random = Math.floor(Math.random() * count);

      User.findOne().skip(random).exec(
        function (err, result) {
          if(err) return reject(err);
          console.log(result);
          console.log(" -----------------------------");
          resolve(mongoose.Types.ObjectId(result._id));

          // console.log("Users here?");
          // console.log(result);
          // return mongoose.Types.ObjectId(result._id);
          // // result is random
        });
      });
    });
  }


  // describe('studio database seeding', function() {
  //   it('should have been inserted 20 users', function() {
  // seeds = generateStudios();
  // sinon.spy(Studio, 'insertMany');
  // console.log(seeds);
  // Studio.insertMany(seeds, onInsert);
  // Studio.insertMany.called.should.be.true;
  // mongoose.disconnect();
  //   });
  //
  // });

  var config   = require('../../config/database');

//   Promise.all(generateStudios(20)).then(function(studios){
//     mongoose.connect(config.db.test, function(err) {
//       if(err) throw err;
//
//       for(var i in mongoose.connection.collections) {
//         mongoose.connection.collections[i]
//         .remove(function(){});
//       }
//
//       Studio.insertMany(studios, onInsert);
//
//       mongoose.disconnect();
//     });
//   }
// );




function onInsert(err, docs){
  if (err) {
    console.error(err);
  } else {
    console.log('Studio were successfully stored', docs.count());
  }
}


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
