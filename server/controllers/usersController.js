var Promise = require('bluebird');
var dbUtils = Promise.promisifyAll(require('../db/dbUtils'));
var controllerUtils = require('./controllerUtils');
var authUtils = Promise.promisifyAll(require('../auth/authUtils'));
var emailUtilsAsync = Promise.promisify(require('../ping/emailUtils'));
var smsUtilsAsync = Promise.promisify(require('../ping/smsUtils'));

module.exports = {
  // Admins can add members into their organization
  postAddMember: function(req, res, next) {
    dbUtils.getOrgAsync({admin_id: req.user.id})
      .then(function(org) {
        // User must be admin
        if (req.user.id !== org.admin_id) {
          throw new Error(403);
        }
        // Member is added to user's organization
        req.body.organization_id = org.id;
        return req.body;
      }).then(dbUtils.addUserAsync)
      .then(function(member) { controllerUtils.serveStatus(res, 201); })
      .catch(function(error) { controllerUtils.checkError(res, error); });
  },

  // Users can update themselves, and admins can update members of their organization
  putUpdateMember: function(req, res, next) {
    // First check if we have permission to update
    Promise.try(function() {
      // Users can update themselves
      if (req.user.id === +req.params.id) {
        return;
      }
      return Promise.join(dbUtils.getUserAsync({id: req.params.id}), dbUtils.getOrgAsync({admin_id: req.user.id}), function(member, org) {
        // Member must be of the same organization
        if (member.organization_id !== org.id) {
          throw new Error(403);
        }
      });
    }).then(function() {
      req.body.id = req.params.id;
      return dbUtils.updateUserAsync(req.body);
    }).then(function() { controllerUtils.serveStatus(res, 204); })
    .catch(function(error) { controllerUtils.checkError(res, error); });
  },

  // Users can change their password
  putChangePassword: function(req, res, next) {
    // First check if we have permission to update
    dbUtils.getUserAsync(req.user)
    .then(function(user) {
      return authUtils.checkPasswordAsync(user, req.body.old_password);
    }).then(function(match) {
      if (!match) {
        throw new Error(403);
      }
      return authUtils.hashPasswordAsync(req.body.new_password);
    }).then(function(hash) {
      return dbUtils.updateUserAsync({id: req.user.id, password_hash: hash});
    }).then(function() {
      controllerUtils.serveStatus(res, 204);
    }).catch(function(error) {
      controllerUtils.checkError(res, error);
    });
  },

  // Users can delete themselves, and admins can delete members of their organization
  // Admins cannot be deleted
  postDeleteMember: function(req, res, next) {
    Promise.try(function() {
      if (req.user.id === +req.params.id) {
        return dbUtils.getUserAsync(req.user)
          .then(function(user) {
            if (!user.organization_id) {
              return false;
            }
            return dbUtils.getOrgAsync({id: user.organization_id})
              .then(function(org) {
                // Admins cannot be deleted
                if (+req.params.id === org.admin_id) {
                  throw new Error(403);
                }
                return org;
              });
          });
      }
      return Promise.join(dbUtils.getUserAsync(req.user), dbUtils.getUserAsync({id: req.params.id}), function(user, member) {
          if (!user.organization_id || user.organization_id !== member.organization_id) {
            throw new Error(403);
          }
          return user;
        }).then(function(user) { return dbUtils.getOrgAsync({id: user.organization_id}); })
        .then(function(org) {
          // User must be admin
          if (req.user.id !== org.admin_id) {
            throw new Error(403);
          }
          return org;
        });
    }).then(function(org) {
      if (org) {
        // If a default user is deleted, reset it back to admin
        if (+req.params.id === org.default_id) {
          return dbUtils.updateOrgAsync({id: org.id, default_id: org.admin_id});
        }
      }
    }).then(function() { return dbUtils.deleteUserAsync(req.params); })
    .then(function() { controllerUtils.serveStatus(res, 204); })
    .catch(function(error) { controllerUtils.checkError(res, error); });
  },

  // Must share organizations
  postPing: function(req, res, next) {
    Promise.join(dbUtils.getUserAsync(req.user), dbUtils.getUserAsync({id: req.body.id}), function(user, member) {
      if (!user.organization_id || user.organization_id !== member.organization_id) {
        throw new Error(403);
      }
      return member;
    }).then(function(member) {
      // SMS ping
      var smsPromise = Promise.resolve();

      // Construct message text
      var subject = member.first_name + ' ' + member.last_name + ', ';
      subject += req.body.visitor ? req.body.visitor + ' is here to see you' : 'you have a visitor';
      var text = '';
      if (req.body.text) {
        text = '"' + req.body.text + '"';
      }

      // SMS ping
      if (member.phone) {
        var message = subject;
        if(text) {
          message += ': ' + text;
        }
        var smsOptions = {
          to: member.phone,
          text: message
        };
        smsPromise = smsUtilsAsync(smsOptions);
      }

      // Email ping
      var mailOptions = {
        to: member.email,
        subject: subject,
        text: text
      };
      var emailPromise = emailUtilsAsync(mailOptions);

      return [smsPromise, emailPromise];
    }).all().then(function() {
      controllerUtils.serveStatus(res, 204);
    }).catch(function(error) { controllerUtils.checkError(res, error); });
  }
};
