var passport = require('../auth/auth');
var authUtils = require('../auth/authUtils');
var testData = require('../data/testData');
var dbUtils = require('../utils/dbUtils/dbUtils');
var emailUtils = require('../utils/pingUtils/emailUtils');
var smsUtils = require('../utils/pingUtils/smsUtils');

// Set to true to use the database or false to use test data
var useDb = true;

// Serves default messages for corresponding error codes
var serveStatus = function(res, statusCode, message) {
  res.status(statusCode);
  if (statusCode === 201) {
    defaultMessage = 'Created';
  } else if (statusCode === 204) {
    defaultMessage = 'No content';
  } else if (statusCode === 301) {
    defaultMessage = 'Ping sent';
  } else if (statusCode === 401) {
    defaultMessage = 'Invalid login';
  } else if (statusCode === 422) {
    defaultMessage = 'Unique field already taken';
  }
  return res.end(message || defaultMessage);
};

// Handles addUser errors
var checkUserError = function(res, error) {
  if (error) {
    if (error.match(/unique/i)) {
      if (error.match(/phone/i)) {
        return serveStatus(res, 422, 'Phone number taken');
      } else if (error.match(/email/i)) {
        return serveStatus(res, 422, 'Email taken');
      }
    }
    return serveStatus(res, 500);
  }
};

var login = function(req, res, next) {
  passport.authenticate('local', function(error, user, info) {
    if (error) {
      console.error(error);
      return next(error);
    }
    if (!user) {
      return serveStatus(res, 401);
    }
    req.logIn(user, function(error) {
      if (error) {
        return next(error);
      }
      // TODO: add proper response handling
      return serveStatus(res, 201);
    });
  })(req, res, next);
};

// These functions have else branches in the case of useDb false
module.exports = {
  getDashboardInfo: function(req, res, next) {
    if (useDb) {
      var user = {id: req.query.id};
      dbUtils.getUsersShareOrganization(user, function(error, results) {
        if (error) {
          console.error(error);
          serveStatus(res, 500);
        }
        res.end(JSON.stringify(results));
      });
    } else {
      // Return fake data
      var orgInfo = testData.data;
      res.end(JSON.stringify(orgInfo));
    }
  },

  getClientInfo: function(req, res, next) {
    if (useDb) {
      var user = {id: req.query.id};
      dbUtils.getUsersShareOrganization(user, function(error, results) {
        if (error) {
          console.error(error);
          serveStatus(res, 500);
        }
        res.end(JSON.stringify(results));
      });
    } else {
      // Return fake data
      var orgInfo = testData.data;
      res.end(JSON.stringify(orgInfo));
    }
  },

  postAddMember: function(req, res, next) {
    dbUtils.getUser(req.user, function(error, user) {
      if (error) {
        console.error(error);
        serveStatus(res, 500);
      } else {
        req.body.organization_id = user.organization_id;
        // Must delete phone entry to maintain uniqueness
        if (req.body.phone === '') {
          delete req.body.phone;
        }
        dbUtils.addUser(req.body, function(error, user) {
          if (!checkUserError(res, error)) {
            return serveStatus(res, 201);
          }
        });
      }
    });
  },

  postUpdateMember: function(req, res, next) {
    dbUtils.updateUser(req.body, function(error, user) {
      if (!checkUserError(res, error)) {
        return serveStatus(res, 204);
      }
    });
  },

  postPing: function(req, res, next) {
    var params = req.body;
    dbUtils.getUser(params, function(error, user) {
      if (error) {
        console.error(error);
        serveStatus(res, 500);
      }
      // SMS ping
      if (user.phone !== '') {
        var message;
        if (params.visitor === '') {
          message = 'You have a visitor';
        } else {
          message = 'Visit from ' + params.visitor;
        }
        if (params.text !== '') {
          message += ' - ' + params.text;
        }
        var smsOptions = {
          to: user.phone,
          text: message
        };
        smsUtils(smsOptions, function(error, results) {
          if (error) {
            console.error(error);
          }
        });
      }
      // Email ping
      var subject;
      if (params.visitor === '') {
        subject = 'You have a visitor';
      } else {
        subject = params.visitor + ' is here to see you';
      }
      var mailOptions = {
        to: user.email,
        subject: subject,
        text: params.text
      };
      emailUtils(mailOptions, function(error, results) {
        if (error) {
          console.error(error);
          serveStatus(res, 500);
        }
        serveStatus(res, 301);
      });
    });
  },

  postSignup: function(req, res, next) {
    var user = req.body;
    user.organization_id = 1; // TODO: Implement organizations
    var emailRequest = {email: req.body.email};
    authUtils.hashPassword(user.password, function(error, hash) {
      if (error) {
        console.error(error);
        serveStatus(res, 500);
      }
      user.password_hash = hash;
      dbUtils.addUser(user, function(error, results) {
        if (!checkUserError(res, error)) {
          login(req, res, next);
        }
      });
    });
  },

  postLogin: function(req, res, next) {
    login(req, res, next);
  }
};
