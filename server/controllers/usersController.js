var dbUtils = require('../db/dbUtils');
var controllerUtils = require('./controllerUtils');
var emailUtils = require('../ping/emailUtils');
var smsUtils = require('../ping/smsUtils');

module.exports = {
  // Must be admin
  postAddMember: function(req, res, next) {
    dbUtils.getUser(req.user, function(error, user) {
      if (error) {
        console.error(error);
        return controllerUtils.serveStatus(res, 500);
      }
      dbUtils.getOrganization({id: user.organization_id}, function(error, org) {
        if (error) {
          console.error(error);
          return controllerUtils.serveStatus(res, 500);
        }
        if (user.id !== org.admin_id) {
          return controllerUtils.serveStatus(res, 403);
        }
        req.body.organization_id = user.organization_id;
        dbUtils.addUser(req.body, function(error, member) {
          if (!controllerUtils.checkUserError(res, error)) {
            return controllerUtils.serveStatus(res, 201);
          }
        });
      });
    });
  },

  // Must be admin and share organizations or be updating self
  postUpdateMember: function(req, res, next) {
    if (req.user.id === +req.body.id) {
      dbUtils.updateUser(req.body, function(error, user) {
        if (!controllerUtils.checkUserError(res, error)) {
          return controllerUtils.serveStatus(res, 204);
        }
      });
      return;
    }
    dbUtils.getUser(req.user, function(error, user) {
      if (error) {
        console.error(error);
        return controllerUtils.serveStatus(res, 500);
      }
      dbUtils.getUser({id: req.body.id}, function(error, member) {
        if (error) {
          console.error(error);
          return controllerUtils.serveStatus(res, 500);
        }
        if (user.organization_id !== member.organization_id) {
          return controllerUtils.serveStatus(res, 403);
        }
        dbUtils.getOrganization({id: user.organization_id}, function(error, org) {
          if (error) {
            console.error(error);
            return controllerUtils.serveStatus(res, 500);
          }
          if (user.id !== org.admin_id) {
            return controllerUtils.serveStatus(res, 403);
          }
          dbUtils.updateUser(req.body, function(error, member) {
            if (!controllerUtils.checkUserError(res, error)) {
              return controllerUtils.serveStatus(res, 204);
            }
          });
        });
      });
    });
  },

  // Must be admin and share organizations or be deleting self
  postDeleteMember: function(req, res, next) {
    dbUtils.getUser(req.user, function(error, user) {
      if (error) {
        console.error(error);
        return controllerUtils.serveStatus(res, 500);
      }
      if (!user.organization_id) {
        if (user.id === +req.body.id) {
          dbUtils.deleteUser(req.body, function(error, user) {
            if (error) {
              console.error(error);
              return controllerUtils.serveStatus(res, 500);
            }
            return controllerUtils.serveStatus(res, 204);
          });
        }
        return controllerUtils.serveStatus(res, 403);
      }
      dbUtils.getUser(req.body, function(error, member) {
        if (error) {
          console.error(error);
          return controllerUtils.serveStatus(res, 500);
        }
        if (user.organization_id !== member.organization_id) {
          return controllerUtils.serveStatus(res, 403);
        }
        dbUtils.getOrganization({id: member.organization_id}, function(error, organization) {
          if (error) {
            console.error(error);
            return controllerUtils.serveStatus(res, 500);
          }
          if (organization.admin_id !== user.id) {
            return controllerUtils.serveStatus(res, 403);
          }
          if (user.id === member.id) {
            return controllerUtils.serveStatus(res, 400);
          }
          if (organization.default_id === member.id) {
            dbUtils.updateOrganization({id: organization.id, default_id: organization.admin_id}, function(error) {
              if (error) {
                console.error(error);
                return controllerUtils.serveStatus(res, 500);
              }
              dbUtils.deleteUser(member, function(error, user) {
                if (error) {
                  console.error(error);
                  return controllerUtils.serveStatus(res, 500);
                }
                return controllerUtils.serveStatus(res, 204);
              });
            });
            return;
          }
          dbUtils.deleteUser(member, function(error, user) {
            if (error) {
              console.error(error);
              return controllerUtils.serveStatus(res, 500);
            }
            return controllerUtils.serveStatus(res, 204);
          });
        });
      });
    });
  },

  // Must share organizations
  postPing: function(req, res, next) {
    var params = req.body;
    dbUtils.getUser(req.user, function(error, user) {
      if (error) {
        console.error(error);
        return controllerUtils.serveStatus(res, 500);
      }
      dbUtils.getUser(params, function(error, member) {
        if (error) {
          console.error(error);
          return controllerUtils.serveStatus(res, 500);
        }
        if (!user.organization_id || user.organization_id !== member.organization_id) {
          return controllerUtils.serveStatus(res, 403);
        }
        // SMS ping
        if (member.phone) {
          var message = params.visitor ? 'Visit from ' + params.visitor : 'You have a visitor';
          if (params.text) {
            message += ' - ' + params.text;
          }
          var smsOptions = {
            to: member.phone,
            text: message
          };
          smsUtils(smsOptions, function(error, results) {
            if (error) {
              console.error(error);
            }
          });
        }
        // Email ping
        var subject = params.visitor ? params.visitor + ' is here to see you' : 'You have a visitor';
        var mailOptions = {
          to: member.email,
          subject: subject,
          text: params.text
        };
        emailUtils(mailOptions, function(error, results) {
          if (error) {
            console.error(error);
            return controllerUtils.serveStatus(res, 500);
          }
          return controllerUtils.serveStatus(res, 204);
        });
      });
    });
  }
};
