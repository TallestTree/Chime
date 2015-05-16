module.exports = {
  // Serves default messages for corresponding error codes
  serveStatus: function(res, statusCode, message) {
    statusCode = statusCode || 500;
    message = message || '';
    res.status(statusCode);
    if (statusCode === 201) {
      message = 'Created';
    } else if (statusCode === 204) {
      message = 'No content';
    } else if (statusCode === 301) {
      message = 'Ping sent';
    } else if (statusCode === 401) {
      message = 'Invalid login';
    } else if (statusCode === 403) {
      message = 'Forbidden';
    } else if (statusCode === 422) {
      message = 'Unique field already taken';
    } else if (statusCode === 500) {
      message = 'Internal server error';
    }
    return res.end(message);
  },

  // Handles connection errors
  checkError: function(res, error) {
    if (error) {
      return module.exports.serveStatus(res, 500);
    }
  },

  // Handles user errors
  checkUserError: function(res, error) {
    if (error) {
      if (error.match(/unique/i)) {
        if (error.match(/phone/i)) {
          return module.exports.serveStatus(res, 422, 'Phone number taken');
        }
        if (error.match(/email/i)) {
          return module.exports.serveStatus(res, 422, 'Email taken');
        }
      }
    }
    return module.exports.checkError(res, error);
  },

  // Handles organization errors
  checkOrgError: function(res, error) {
    if (error) {
      if (error.match(/unique/i)) {
        if (error.match(/name/i)) {
          return module.exports.serveStatus(res, 422, 'Org name taken');
        }
      }
    }
    return module.exports.checkError(res, error);
  },

  sanitizeFields: function(members, fields) {
    members.forEach(function(member) {
      fields.forEach(function(field) {
        delete member[field];
      });
    });
  }
};
