var testData = require('../data/testData');

// Set to true to use the database or false to use test data
var useDB = false;

// These functions have else branches in the case of useDB false
module.exports = {
  getDashboardInfo: function(req, res, next) {
    if(useDB) {
      // TODO: add database call
    } else {
      // Return fake data
      var orgInfo = testData.data;
      res.end(JSON.stringify(orgInfo));
    }
  },

  getClientInfo: function(req, res, next) {
    if(useDB) {
      // TODO: add database call
    } else {
      // Return fake data
      var orgInfo = testData.data;
      res.end(JSON.stringify(orgInfo));
    }
  }
};
