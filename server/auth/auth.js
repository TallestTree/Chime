var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dbUtils = require('../utils/dbUtils/dbUtils');
var authUtils = require('../auth/authUtils');

passport.serializeUser(function(user, done) {
  done(null, {id: user.id});
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    dbUtils.getUser({ email: username }, function(error, user) {
      if (error) {
        return done(null, false);
      }
      authUtils.checkPassword(user, password, function(error, match) {
        if (error) {
          console.error(error);
          return done(null, false);
        }

        if (!match) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }
));

module.exports = passport;
