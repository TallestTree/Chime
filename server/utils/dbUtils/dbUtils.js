var pg = require('pg');
var config = process.env.DATABASE_URL || require('../../config/config').proddb.config;
var md5 = require('md5');

// Required, optional, and auto fields are mutually exclusive
// Unique fields are drawn from any of the others
var allFields = {
  user: {
    required: ['first_name', 'last_name', 'email'],
    optional: ['organization_id', 'middle_name', 'password_hash', 'phone', 'photo', 'department', 'title'],
    auto: ['id', 'created_at', 'updated_at'],
    unique: ['id', 'phone', 'email']
  },
  organization: {
    required: ['admin_id', 'name'],
    optional: ['logo', 'welcome_message'],
    auto: ['id', 'created_at', 'updated_at'],
    unique: ['id', 'admin_id', 'name']
  }
};

// Augments a callback with a prepended fail message or a chained success callback
// Stores prepended on-fail message on prepend property
var augmentCb = function(cb, failMessage, successCb) {
  cb = cb || function(err) {
    console.error(err);
  };
  var onFail = function(err, result) {
    cb(err && (failMessage ? failMessage + ' > ': '') + err, result);
  };
  var onSuccess = function(err, result) {
    if (successCb) {
      successCb(onFail, result);
    } else {
      cb(err, result);
    }
  };
  return function(err, result) {
    if (err) {
      onFail(err, result);
    } else {
      onSuccess(err, result);
    }
  };
};

// Checks for required fields and replaces missing optional fields with null
var augmentFields = function(entry, fields) {
  var validatedEntry = {};
  entry = entry || {};
  for (var i=0; i<fields.required.length; i++) {
    if (!entry[fields.required[i]]) {
      return null;
    }
    validatedEntry[fields.required[i]] = entry[fields.required[i]];
  }
  for (var j=0; j<fields.optional.length; j++) {
    validatedEntry[fields.optional[j]] = entry[fields.optional[j]] || null;
  }
  // Defaults photo to one from gravatar
  if (validatedEntry.photo === null) {
    validatedEntry.photo = 'http://www.gravatar.com/avatar/' + md5.digest_s(validatedEntry.email);
  }
  return validatedEntry;
};

// Validate against possible fields
var getEntryFields = function(entry, possibleEntryFields) {
  if (!entry) {
    return [];
  }
  var fields = [];
  for (var i=0; i<possibleEntryFields.length; i++) {
    if (entry[possibleEntryFields[i]]) {
      fields.push(possibleEntryFields[i]);
    }
  }
  return fields;
};

// Sets up database connection and queries entry
// Params has properties entry, entryFields, queryString, callback, and success
// Helper function for addEntry and getEntry
var connect = function(params) {
  pg.connect(config, function(err, client, done) {
    if (err) {
      return augmentCb(params.callback, 'failed database request')(err);
    }

    var entryFieldStrings = params.entryFields.map(function(entryField) {
      return entryField.join(',');
    });

    // Create a scope paramIndex so entryFields' index counts don't reset
    var paramIndex = 1;
    var parameters = params.entryFields.map(function(entryField) {
      return '$'+entryField.map(function() {
        return paramIndex++;
      }).join(',$');
    });

    var entryFieldValues = params.entryFields.map(function(entryField) {
      return entryField.map(function(current) {
        return params.entry[current];
      });
    }).reduce(function(memo, current) {
      return memo.concat(current);
    }, []);

    client.query(params.queryString(entryFieldStrings, parameters), entryFieldValues, function(err, result) {
      if (err) {
        done(client);
        return augmentCb(params.callback, 'failed client request')(err);
      }
      done();
      params.success(params.callback, result);
    });
  });
};

// Helper function for addUser and addOrganization
var addEntry = function(type, entry, cb) {
  entry = augmentFields(entry, allFields[type]);
  if (!entry) {
    return cb('required fields missing');
  }
  var fields = allFields[type].required.concat(allFields[type].optional);
  var insertString = function(entryFieldStrings, parameters) {
    return 'INSERT INTO '+type+'s ('+entryFieldStrings[0]+') VALUES ('+parameters[0]+') RETURNING *';
  };
  var success = function(cb, result) {
    cb(null, result.rows[0]);
  };
  connect({
    entry: entry,
    entryFields: [fields],
    queryString: insertString,
    callback: cb,
    success: success
  });
};

// Helper function for updateUser and updateOrganization
// Uses the unique fields attached to entry to update the rest
var updateEntry = function(type, entry, cb) {
  // Validate against possible fields
  var fields = getEntryFields(entry, allFields[type].required.concat(allFields[type].optional));
  var uniqueFields = getEntryFields(entry, allFields[type].unique);
  if (!uniqueFields.length) {
    return cb('unique fields missing');
  }

  var updateString = function(entryFieldStrings, parameters) {
    return 'UPDATE '+type+'s SET ('+entryFieldStrings[0]+',updated_at) = ('+parameters[0]+',DEFAULT) WHERE ('+entryFieldStrings[1]+') = ('+parameters[1]+') RETURNING *';
  };
  var success = function(cb, result) {
    if (result.rows.length) {
      cb(null, result.rows[0]);
    } else {
      cb('no matches');
    }
  };
  connect({
    entry: entry,
    entryFields: [fields, uniqueFields],
    queryString: updateString,
    callback: cb,
    success: success
  });
};

// Helper function for getUsers and getOrganizations
var getEntries = function(type, entry, cb) {
  // Validate against possible fields
  var fields = getEntryFields(entry, allFields[type].required.concat(allFields[type].optional, allFields[type].auto));
  if (!fields.length) {
    return cb('no fields supplied');
  }

  var selectString = function(entryFieldStrings, parameters) {
    return 'SELECT * FROM '+type+'s WHERE ('+entryFieldStrings[0]+') = ('+parameters[0]+')';
  };
  var success = function(cb, result) {
    if (result.rows.length) {
      cb(null, result.rows);
    } else {
      cb('no matches');
    }
  };
  connect({
    entry: entry,
    entryFields: [fields],
    queryString: selectString,
    callback: cb,
    success: success
  });
};

// Helper function for getUser and getOrganization
var getEntry = function(type, entry, cb) {
  var rejectIfMultiple = function(cb, users) {
    if (users.length>1) {
      cb('multiple matches');
    } else {
      cb(null, users[0]);
    }
  };
  getEntries(type, entry, augmentCb(cb, null, rejectIfMultiple));
};

// Takes a user entry and adds it
exports.addUser = function(user, cb) {
  addEntry('user', user, augmentCb(cb, 'adding user'));
};

// Takes an organization entry and adds it
exports.addOrganization = function(organization, cb) {
  var updateUser = function(cb, organization) {
    exports.updateUser({
      id: organization.admin_id,
      organization_id: organization.id
    }, cb);
  };
  addEntry('organization', organization, augmentCb(cb, 'adding organization', updateUser));
};

// Takes a user entry and updates it
exports.updateUser = function(user, cb) {
  updateEntry('user', user, augmentCb(cb, 'updating user'));
};

// Takes an organization entry and updates it
exports.updateOrganization = function(organization, cb) {
  updateEntry('organization', organization, augmentCb(cb, 'updating organization'));
};

// Takes partial user fields and returns user entry
exports.getUser = function(user, cb) {
  getEntry('user', user, augmentCb(cb, 'getting user'));
};

// Takes partial user fields and returns user entries
exports.getUsers = function(users, cb) {
  getEntries('user', users, augmentCb(cb, 'getting users'));
};

// Takes partial organization fields and returns organization entry
exports.getOrganization = function(organization, cb) {
  getEntry('organization', organization, augmentCb(cb, 'getting organization'));
};

// Takes partial organization fields and returns organization entries
exports.getOrganizations = function(organizations, cb) {
  getEntries('organization', organizations, augmentCb(cb, 'getting organizations'));
};

// Takes an organization and retrieves all users belonging to it
// Attaches the users array as the property users and returns the organization
exports.getUsersByOrganization = function(organization, cb) {
  var getUsers = function(cb, organization) {
    var buildOrgInfo = function(cb, users) {
      organization.members = users;
      cb(null, organization);
    };
    exports.getUsers({organization_id: organization.id}, augmentCb(cb, null, buildOrgInfo));
  };
  exports.getOrganization(organization, augmentCb(cb, 'getting users by organization', getUsers));
};

// Takes a user and retrieves all users that share an organization
// Attaches the users array as the property users and returns the organization
exports.getUsersShareOrganization = function(user, cb) {
  var getUsersByOrganization = function(cb, user) {
    if (!user.organization_id) {
      cb('user is not in an organization');
    } else {
      exports.getUsersByOrganization({id: user.organization_id}, augmentCb(cb, 'getting users that share organization'));
    }
  };
  exports.getUser(user, augmentCb(cb, 'getting users share organization', getUsersByOrganization));
};
