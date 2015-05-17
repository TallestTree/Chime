var dbUtils = require('../db/dbUtils');
var controllerUtils = require('./controllerUtils');
var passport = require('../auth/auth');
var authUtils = require('../auth/authUtils');

var login = function(req, res, next) {
  passport.authenticate('local', function(error, user, info) {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (!user) {
      return controllerUtils.serveStatus(res, 401);
    }
    req.login(user, function(error) {
      if (error) {
        return next(error);
      }
      req.session.passport.user.admin_only = true;
      return controllerUtils.serveStatus(res, 201);
    });
  })(req, res, next);
};

module.exports = {
  postSignup: function(req, res, next) {
    var user = req.body;
    authUtils.hashPassword(user.password, function(error, hash) {
      if (error) {
        console.error(error);
        return controllerUtils.serveStatus(res, 500);
      }
      user.password_hash = hash;
      dbUtils.addUser(user, function(error, results) {
        if (!controllerUtils.checkUserError(res, error)) {
          login(req, res, next);
        }
      });
    });
  },

  postLogin: function(req, res, next) {
    login(req, res, next);
  },

  postClientLogin: function(req, res, next) {
    var user = req.session.passport.user;
    req.login(user, function(error) {
      if (error) {
        return next(error);
      }
      req.session.passport.user.admin_only = false;
      return controllerUtils.serveStatus(res, 201, 'Switched to client');
    });
  },

  postLogout: function(req, res, next) {
    req.logout();
    return controllerUtils.serveStatus(res, 204);
  },

  getAuth: function(req, res, next) {
    return controllerUtils.serveStatus(res, 200);
  }
};
