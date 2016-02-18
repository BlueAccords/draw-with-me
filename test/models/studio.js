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
