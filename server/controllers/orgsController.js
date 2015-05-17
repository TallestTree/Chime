var dbUtils = require('../db/dbUtils');
var controllerUtils = require('./controllerUtils');

module.exports = {
  // Must not have an organization
  postAddOrg: function(req, res, next) {
    dbUtils.getUser(req.user, function(error, user) {
      if (error) {
        console.error(error);
        return controllerUtils.serveStatus(res, 500);
      }
      if (user.organization_id) {
        return controllerUtils.serveStatus(res, 422, 'Members may only be in one organization');
      }
      req.body.admin_id = user.id;
      dbUtils.addOrganization(req.body, function(error, org) {
        if (!controllerUtils.checkOrgError(res, error)) {
          return controllerUtils.serveStatus(res, 201);
        }
      });
    });
  },

  // Must be admin of organization
  postUpdateOrg: function(req, res, next) {
    dbUtils.getOrganization({admin_id: req.user.id}, function(error, org) {
      if (error) {
        if (error.match(/no matches/i)) {
          return controllerUtils.serveStatus(res, 403);
        }
        console.error(error);
        return controllerUtils.serveStatus(res, 500);
      }
      req.body.id = org.id;
      if (req.body.default_id) {
        dbUtils.getUser({id: req.body.default_id}, function(error, member) {
          if (error) {
            console.error(error);
            return controllerUtils.serveStatus(res, 500);
          }
          if (member.organization_id !== org.id) {
            return controllerUtils.serveStatus(res, 400);
          }
          dbUtils.updateOrganization(req.body, function(error, org) {
            if (!controllerUtils.checkOrgError(res, error)) {
              return controllerUtils.serveStatus(res, 204);
            }
          });
        });
        return;
      }
      dbUtils.updateOrganization(req.body, function(error, org) {
        if (!controllerUtils.checkOrgError(res, error)) {
          return controllerUtils.serveStatus(res, 204);
        }
      });
    });
  },

  // TODO
  postDeleteOrg: function(req, res, next) {
    controllerUtils.serveStatus(res, 501);
  },

  // Must be in organization
  getDashboardInfo: function(req, res, next) {
    var user = req.user;
    dbUtils.getUsersShareOrganization(user, function(error, results) {
      if(error) {
        console.error(error);
        return controllerUtils.serveStatus(res, 500);
      }
      controllerUtils.sanitizeFields(results.members, ['password_hash']);
      res.end(JSON.stringify(results));
    });
  },

  // Must be in organization
  getClientInfo: function(req, res, next) {
    var user = req.user;
    dbUtils.getUsersShareOrganization(user, function(error, results) {
      if (error) {
        console.error(error);
        return controllerUtils.serveStatus(res, 500);
      }
      controllerUtils.sanitizeFields(results.members, ['password_hash', 'phone', 'email']);
      res.end(JSON.stringify(results));
    });
  }
};
