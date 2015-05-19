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
      error = error.message || error;

      // Check for user errors
      if (error.match(/user/i)) {
        if (error.match(/unique/i)) {
          if (error.match(/phone/i)) {
            return module.exports.serveStatus(res, 422, 'Phone number taken');
          }
          if (error.match(/email/i)) {
            return module.exports.serveStatus(res, 422, 'Email taken');
          }
        }
      }

      // Check for org errors
      if (error.match(/organization/i)) {
        if (error.match(/unique/i)) {
          if (error.match(/name/i)) {
            return module.exports.serveStatus(res, 422, 'Org name taken');
          }
        }
        if (error.match(/no matches/i)) {
          return module.exports.serveStatus(res, 403);
        }
      }

      // Parse out error code if one exists
      if (error.match(/\d{3}/)) {
        return module.exports.serveStatus(res, +error.match(/\d{3}/), error.replace(/\d{3}\s?/, ''));
      }
      // Log out internal server errors
      console.error(error);
      return module.exports.serveStatus(res, 500);
    }
  },

  sanitizeFields: function(members, fields) {
    if (members) {
      members.forEach(function(member) {
        fields.forEach(function(field) {
          delete member[field];
        });
      });
    }
  }
};
