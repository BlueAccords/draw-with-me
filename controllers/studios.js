
var mongoose = require('mongoose');
var Studio = require('../models/studio');
/*
Quick req.query example.
GET /search?q=tobi+ferret
req.query.q => "tobi ferret"
*/

// Load Studio into session/req data.
exports.load = function(req, res, next, id) {
  // console.log(req.params);
  // console.log(" idddddd ");
  // console.log(id);
  // console.log("help ^?");
  // FIXME: i have no idea what i was solving here in the studio controller
  Studio.load(id, function(err, studio) {
    if(err) {
      console.log(err);
      return next(err);
      // FIXME: should redirect to 404 page or something.
      // though it is a server error that it couldn't cast the id to ObjectId.
      // return res.redirect('/studios');
    }

    if(!studio) return next(new Error('Studio not found'));
    req.studio = studio;
    next();
  });
};

// List Studios
// Assign page number, and number of pages.
// page number is dependent on query variables(example at top of file.)
// page number is offset by 1 due to arrays starting at 0.
exports.index = function(req, res) {
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  var perPage = 10; // 10 studios per page.
  var options = {
    perPage: perPage,
    page: page
  };

  Studio.list(options, function(err, studios) {
    if(err) return res.render('error');
    // .count() gets the number of matching documents.
    Studio.count().exec(function(err, count) {
      res.render('studios/index', {
        title: 'Studios',
        studios: studios,
        page: page + 1,
        // rounds up given the total documents / docs per page.
        // i.e. 125 documents / 10 per page = 13 pages.
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

// New Studio
exports.new = function(req, res) {
  res.render('studios/new', {
    title: 'New Studio',
    studio: new Studio({})
  });
};

// Create a new studio.
// TODO: include image uploading for studio profile image later.
// TODO: slugify studio names(possibly store in separate field)
// and redirect to the slugified field
exports.create = function(req, res) {
  var images = req.files.image ?
    [req.files.image] : undefined;
  // req.body is the form submitted information.
  var studio = new Studio(req.body);
  // FIXME: session data may be stored else where atm.
  studio.owner = req.user;
  studio.createAndSave(images, function(err) {
    if(!err) {
      req.flash('success', 'Successfully created studio!');
      return res.redirect('/studios/'+studio._id);
    }
    res.render('studios/new', {
      title: 'New Studio',
      studio: studio,
      // FIXME: fix error rendering to studio new and edit views.
      errors: err
    });
  });
};


// edit a studio
exports.edit = function(req, res) {
  res.render('studios/edit', {
    title: 'Edit ' + req.studio.title,
    studio: req.studio
  });
};

// Update the studio
// FIXME: add image uploading/changing for edit studio controller method.
exports.update = function(req, res) {
  var studio = req.studio;
  var images = req.files.image ?
    [req.files.image] :
    undefined;

  // ensure owner is not changed
  delete req.body.owner;
  studio.createAndSave(images, function(err) {
    if(!err) {
      return res.redirect('/studios/' + studio._id);
    }

    res.render('studios/edit', {
      title: 'Edit Studio',
      studio: studio,
      // FIXME: error handling this way is most likely incorrect.
      errors: err
    });
  });
};

// show studio
exports.show = function(req, res) {
  console.log(req.params);
  console.log("help ^?");
  res.render('studios/show', {
    title: req.studio.name,
    studio: req.studio
  });
};

// delete a studio
exports.destroy = function(req, res) {
  var studio = req.studio;
  studio.remove(function() {
    req.flash('info', 'Studio deleted Successfully');
    res.redirect('/studios');
  });
};

// *** USER JOINING/INVITE ***********************************
// TODO: Allow inviting of users.
