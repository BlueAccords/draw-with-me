
// module dependencies

var mongoose = require('mongoose');
var User = mongoose.model('User');
var VerifyToken = mongoose.model('UserToken');

// create User
// IDEA: refactor create user to get it out of passport local strategy.
exports.create = function(req, res) {
  var critera = {$or: [{'local.username' : req.body.username},
                          {'local.email'    : req.body.email
                        }]};

  User.findOne(critera, function(err, user) {
        // checks for and returns any errors
        if(err) {
          console.log(err);
          res.render('signup', {
            message: req.flash(err)
          });
          // return done(err);
        }

        // check to see if email/username is taken.
        if(user) {
          console.log('error user/email already taken');
          res.render('signup', {
            message: req.flash('That Email/Username is already taken'),
          });

          // return done(null, false, req.flash('signupMessage'),
          //             'That Email/Username is already taken');
        } else {
          var newUser = new User();

          // setup User credientials and save to db.
          newUser.local.username = req.body.username;
          newUser.local.email    = req.body.email;
          newUser.local.password = newUser.generateHash(req.body.password);

          // save user to db
          newUser.save(function(err) {
            if(err) {
              console.log('error in db creation')
              res.render('signup', {
                message: req.flash(err)
              });
            }

            // return user
           res.redirect('/dashboard');
          });
        }

    }); 
}

// show dashboard/user profile
exports.show = function(req, res) {
  res.render('dashboard', {
    user: req.user // get user session data and pass to dashboard.
  });
};

// show login form
exports.login = function(req, res) {
  res.render('login', {
    message: req.flash('loginMessage')
  });
};

// signup form
exports.signup = function(req, res){
  res.render('signup', {
    message: req.flash('signupMessage')
  });
};

// logout
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};


// *** User joining of studios ***********************************

exports.join = function(req, res) {
  var studio = req.studio;
  var user = req.user;

  // FIXME: refactor this to use the static method instead of the user specific method.
  // TODO: make it so a user can join or leave a studio by clicking the same button
  User.joinStudio(studio, user, function(err) {
    if(err) {
      req.flash('error', 'You are already a member of this studio!');
    } else {
      req.flash('success', 'Successfully joined studio');
    }
    res.redirect('/studios/' + studio.id);
  });
};


// *** User Email Verification **********************************

exports.verifyUser = function(req, res, next) {
  var token = req.params.token;
  VerifyToken.findOne({token: token}, function(err, resultToken) {
    if(err) return next(err);

    User.findOne({_id: resultToken._userId}, function(err, user) {
      if(err) return next(err);

      user.local.verified = true;
      user.save(function(err, user) {
        if(err) return next(err);

        next(user);
      });
    });
  });
};

