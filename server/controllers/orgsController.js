var Promise = require('bluebird');
var dbUtils = Promise.promisifyAll(require('../db/dbUtils'));
var controllerUtils = require('./controllerUtils');

var getInfo = function(req, res, next, fields) {
  dbUtils.getUsersShareOrgAsync(req.user)
    .then(function(results) {
      controllerUtils.sanitizeFields(results.members, fields);
      res.end(JSON.stringify(results));
    }).catch(function(error) { controllerUtils.checkError(res, error); });
};

module.exports = {
  // User must not have an organization
  postAddOrg: function(req, res, next) {
    dbUtils.getUserAsync(req.user)
      .then(function(user) {
        if (user.organization_id) {
          throw new Error('422 Users may be in only one organization');
        }
        // User is set to admin
        req.body.admin_id = user.id;
        return dbUtils.addOrgAsync(req.body);
      }).then(function() { controllerUtils.serveStatus(res, 201); })
      .catch(function(error) { controllerUtils.checkError(res, error); });
  },

  // User must be admin
  putUpdateOrg: function(req, res, next) {
    dbUtils.getOrgAsync({admin_id: req.user.id})
      .then(function(org) {
        // Updates are on user's organization
        req.body.id = org.id;
        // If default_id is changed, check that new default is in organization
        if (req.body.default_id) {
          return dbUtils.getUserAsync({id: req.body.default_id})
            .then(function(member) {
              if (member.organization_id !== org.id) {
                throw new Error(400);
              }
              return dbUtils.updateOrgAsync(req.body);
            });
        }
      }).then(function() { controllerUtils.serveStatus(res, 204); })
      .catch(function(error) { controllerUtils.checkError(res, error); });
  },

  // User must be admin
  deleteOrg: function(req, res, next) {
    dbUtils.getOrgAsync({admin_id: req.user.id})
      .then(function(org) {
        // Change user's organization to null
        // Let cascade delete all other members
        return dbUtils.updateUserAsync({id: req.user.id, organization_id: null})
          .then(function() { dbUtils.deleteOrgAsync(org); });
    }).then(function() { controllerUtils.serveStatus(res, 204); })
    .catch(function(error) { controllerUtils.checkError(res, error); });
  },

  // User must be in organization
  getDashboardInfo: function(req, res, next) {
    getInfo(req, res, next, ['password_hash']);
  },

  // User must be in organization
  // Acts like getDashboardInfo except direct contact info is removed
  getClientInfo: function(req, res, next) {
    getInfo(req, res, next, ['password_hash', 'phone', 'email']);
  }
};
