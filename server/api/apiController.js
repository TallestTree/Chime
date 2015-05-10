var passport = require('../auth/auth');
var authUtils = require('../auth/authUtils');
// var loggedIn = authUtils.loggedIn;
// var isLoggedIn = authUtils.isLoggedIn;
var testData = require('../data/testData');
var dbUtils = require('../utils/dbUtils/dbUtils');
var emailUtils = require('../utils/pingUtils/emailUtils');
var smsUtils = require('../utils/pingUtils/smsUtils');

// Set to true to use the database or false to use test data
var useDb = true;

// These functions have else branches in the case of useDb false
module.exports = {
  getDashboardInfo: function(req, res, next) {
    if(useDb) {
      var user = {id: req.query.id};
      dbUtils.getUsersShareOrganization(user, function(error, results) {
        if(error) {
          console.error(error);
          res.status(500).end();
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
    if(useDb) {
      var user = {id: req.query.id};
      dbUtils.getUsersShareOrganization(user, function(error, results) {
        if(error) {
          console.error(error);
          res.status(500).end();
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
    res.end('added member');
  },

  postPing: function(req, res, next) {
    var params = req.body;
    dbUtils.getUser(params, function(error, user) {
      if(error) {
        console.error(error);
        res.status(500).end();
      }
      // SMS ping
      if( user.phone !== '' ) {
        var message;
        if( params.visitor === '' ) {
          message = 'You have a visitor';
        } else {
          message = 'Visit from ' + params.visitor;
        }
        if( params.text !== '' ) {
          message += ' - ' + params.text;
        }
        var smsOptions = {
          to: user.phone,
          text: message
        };
        smsUtils(smsOptions, function(error, results) {
          if(error) {
            console.error(error);
          }
        });
      }
      // Email ping
      var subject;
      if( params.visitor === '' ) {
        subject = 'You have a visitor';
      } else {
        subject = params.visitor + ' is here to see you';
      }
      var mailOptions = {
        to: results.email,
        subject: subject,
        text: params.text
      };
      emailUtils(mailOptions, function(error, results) {
        if( error ) {
          console.error(error);
          res.status(500).end();
        }
        res.status(301).end('Ping sent');
      });
    });
  },

  postSignup: function(req, res, next) {
    var params = req.body;
    dbUtils.getUser(params, function(error, user) {
      if( user ) {
        res.end('Email already taken.');
      } else {
        authUtils.hashPassword(params.password, function(error, hash) {
          if( error ) {
            console.error(error);
            res.status(500).end();
          }
          var userOptions = {
            email: params.email,
            password_hash: hash,
            first_name: params.first_name,
            last_name: params.last_name
          };
          dbUtils.addUser(userOptions, function(error, results) {
            passport.authenticate('local', function(error, user, info) {
              if (error) {
                return next(err);
              }
              if (!user) {
                return res.redirect('/');
              }
              req.logIn(user, function(error) {
                if (error) {
                  return next(error);
                }
                // TODO: add proper response handling
                return res.redirect('/client');
              });
            })(req, res, next);
          });
        });
      }
    });
  },

  postLogin: function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
      if (error) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/');
      }
      req.logIn(user, function(error) {
        if (error) {
          return next(error);
        }
        // TODO: add proper response handling
        return res.redirect('/client');
      });
    })(req, res, next);
  }
};
