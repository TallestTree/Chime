var testData = require('../data/testData');
var dbUtils = require('../utils/dbUtils/dbUtils');

// Set to true to use the database or false to use test data
var useDb = true;

// These functions have else branches in the case of useDb false
module.exports = {
  getDashboardInfo: function(req, res, next) {
    if(useDb) {
      var user = {id: req.query.id};
      dbUtils.getUsersShareOrganization(user, function(error, results) {
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
  }
};
