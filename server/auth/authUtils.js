var bcrypt = require('bcrypt-nodejs');

module.exports = {
  hashPassword: function(password, cb) {
    bcrypt.hash(password, null, null, function(error, hash) {
      if (error) {
        console.error('bcrypt hash error:', error);
      }
      cb(error, hash);
    });
  },

  checkPassword: function(user, pGuess, cb) {
    bcrypt.compare(pGuess, user.password_hash, function(error, match) {
      if (error) {
        console.error('bcrypt check error:', error);
      }
      cb(error, match);
    });
  },

  loggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  },

  isLoggedIn: function(req, res, next) {
    res.set('loggedIn', req.isAuthenticated());
    next();
  }
};
