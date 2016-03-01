// load strategies
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// load user model.
// load verification token
var User = require('../models/user');
var VerifyToken = require('../models/userToken.js');
// export passport as function module
//TODO: serialize authorization data.
// unserialize it when session info is needed.
module.exports = function(passport) {
  // passport session setup.
  // passport serializes user info upon login and creates a cookie
  // then deserializes them upon each authentication request.
  // You can set which part of the user info is serialized.

  // serialization
  // saved to session req.session.passport.user
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize
  // searches mongoDB for user by id
  // scrubs user password then stores user Object as a cookie.
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      user.local.passport = undefined;
      done(err, user);
    });
  });
  //============================================================================
  // LOCAL SIGNUP============================================================
  // ===========================================================================

  // changing default check to email/password.
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // enable passing of the request to callback.
  },
  function(req, email, password, done) {

    // async
    // User.findOne won't execute until data is sent back.
    process.nextTick(function() {

      // TODO: refactor local strategy to find username/email in model.
      // find a user whose email/username match the posted info.
      var critera = {$or: [{'local.username' : email},
                          {'local.email'    : email}]};
      // search for user/email and return found user
      User.findOne(critera, function(err, user) {
        // checks for and returns any errors
        if(err) {
          return done(err);
        }

        // check to see if email/username is taken.
        if(user) {
          return done(null, false, req.flash('signupMessage'),
                      'That Email/Username is already taken');
        } else {
          var newUser = new User();

          // setup User credientials and save to db.
          newUser.local.username = req.body.username;
          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);

          // save user to db
          newUser.save(function(err) {
            if(err) {
              throw err;
            }

            // TODO: Refactor user sign up. abstract it outside of passport
            var verifyToken = new VerifyToken({_userId: newUser._id});
            verifyToken.generateVerificationToken(function(err, token) {
              if(err) throw new Error(err);
              
            });
            // return user
            return done(null, newUser);
          });
        }

      });
    });
  }));

  // LOCAL LOGIN ====================================================
  passport.use('local-login', new LocalStrategy({
    //override default of username/password
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // pass back request to callback function
  },
  function(req, email, password, done) {

    // find user via email OR username.
    // check if user trying to login already exists
    var critera = {$or: [{"local.username" : email},
                        {"local.email"    : email}]};

    User.findOne(critera, function(err, user) {

      // returns errors if any
      if (err){
        return done(err);
      }

      // if no user is found OR password is invalid return the same message
      // more secure to display static message(though people could just try
      // to register with the email to find out anyways. meh.)
      if(!user || !user.validPassword(password)){
        return done(null, false, req.flash('loginMessage',
                                'Invalid Email/Username or Password Combination'));
      }
      // finished authentication, return successful user.
      return done(null, user);

    });
  }));
};
