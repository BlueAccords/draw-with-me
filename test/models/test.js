// jshint esversion: 6
var chai   = require('chai'),
    sinon  = require('sinon'),
    expect = chai.expect,
    should = chai.should();

var mongoose = require('mongoose');
var utils = require('../utils');
var User = require('../../models/user');

// convert to objectID from string
// mongoose.Types.ObjectId(stringId);

// generate new objectID.

var id_1 = mongoose.Types.ObjectId();
var id_2 = mongoose.Types.ObjectId();
var id_3 = mongoose.Types.ObjectId();

var userSeeds = [
  {
     _id: id_1,
      local             : {
        username        : 'Bobbert',
        email           : 'peacemaker@nerfed.com',
        password        : 'foobar',
      }
  },
  {
     _id: id_2,
    local: {
      local             : {
        username        : 'kakaka',
        email           : 'greedypull@nerfed.com',
        password        : 'foobar',
      }
    },
  },
  {
    _id: id_3,
      local             : {
        username        : 'Bobbert',
        email           : 'saryn@nerfed.com',
        password        : 'foobar',
      }
  }
];

describe('database testing', function() {
  it('insertMany should be ran once', function() {
    sinon.spy(User, 'insertMany');
    User.insertMany(userSeeds, onInsert);
    User.insertMany.called.should.be.true;
  });

});


function onInsert(err, docs){
  if (err) {
    console.log(err);
  } else {
    console.error('Users were successfully stored', docs);
  }
}
