
// authorization middlewares

exports.requiresLogin = function(req, res, next) {
  if(req.isAuthenticated()) return next();
  if(req.method == 'GET') req.session.returnTo = req.originalURL;
  res.redirect('/login');
};

exports.studio = {
  hasOwnership: function(req, res, next) {
    if(req.studio._owner.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('studio' + req.studio.id);
    }
    next();
  },
  isMemberOf: function() {
    
  }
};
