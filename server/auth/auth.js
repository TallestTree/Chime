var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dbUtils = require('../utils/dbUtils/dbUtils');
var authUtils = require('../auth/authUtils');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    dbUtils.getUser({ email: username }, function(error, user) {
      if( error ) {
        return done(null, false);
      }
      authUtils.checkPassword(user, password, function(match) {
        if( !match ) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }
));

module.exports = passport;
