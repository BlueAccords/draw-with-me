// jshint esversion: 6
var chai   = require('chai'),
    sinon  = require('sinon'),
    expect = chai.expect,
    should = chai.should();

var mongoose = require('mongoose');
var utils = require('../utils');
var Studio = require('../../models/studio');

// convert to objectID from string
// mongoose.Types.ObjectId(stringId);

// generate new objectID.

var id_1 = mongoose.Types.ObjectId();

var userSeeds = [];

for(var i = 0; i < 20; i++) {
  var studioDocument = {
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
  }
}



describe('database testing', function() {
  it('insertMany should be ran once', function() {
    sinon.spy(Studio, 'insertMany');
    Studio.insertMany(userSeeds, onInsert);
    Studio.insertMany.called.should.be.true;
  });

});


function onInsert(err, docs){
  if (err) {
    console.log(err);
  } else {
    console.error('Studio were successfully stored', docs);
  }
}
