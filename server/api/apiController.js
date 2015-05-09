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
    var query = req.body;
    console.log('query:', query);
    dbUtils.getUser(query, function(error, results) {
      if(error) {
        console.error(error);
      }
      // SMS ping
      if( results.phone !== '' ) {
        var message = '';
        if( query.visitor === '' ) {
          message = 'You have a visitor';
        } else {
          message = 'Visit from ' + query.visitor;
        }
        if( query.text !== '' ) {
          message += ' - ' + query.text;
        }
        var smsOptions = {
          to: results.phone,
          text: message
        };
        smsUtils(smsOptions, function(error, results) {
          if(error) {
            console.error(error);
          }
        });
      }
      // Email ping
      var subject = '';
      if( query.visitor === '' ) {
        subject = 'You have a visitor';
      } else {
        subject = query.visitor + ' is here to see you';
      }
      var mailOptions = {
        to: results.email,
        subject: subject,
        text: query.text
      };
      emailUtils(mailOptions, function(error, results) {
        if(error) {
          console.error(error);
        }
        res.status(301).end('Ping sent');
      });
    });
  }
};
