var pg = require('pg');
var config = process.env.NODE_ENV === 'test' ? (process.env.DATABASE_TEST_URL || require('../config/config').testdb.config) : (process.env.DATABASE_URL || require('../config/config').proddb.config);
var md5 = require('md5');
var fs = require('fs');

// Required, optional, and auto fields are mutually exclusive
// Unique fields are drawn from any of the others
var allFields = {
  user: {
    required: ['first_name', 'last_name', 'email'],
    optional: ['organization_id', 'middle_name', 'password_hash', 'phone', 'photo', 'department', 'title'],
    auto: ['id'],
    unique: ['id', 'email']
  },
  organization: {
    required: ['admin_id', 'name'],
    optional: ['default_id', 'logo', 'welcome_message'],
    auto: ['id'],
    unique: ['id', 'admin_id', 'default_id', 'name']
  }
};

// Augments a callback with a prepended fail message or a chained success callback
// Stores prepended on-fail message on prepend property
var augmentCb = function(cb, failMessage, successCb) {
  cb = cb || function(error) {
    console.error(error);
  };
  var onFail = function(error, result) {
    // If an error is thrown, prepend a failMessage if one exists
    cb(error && (failMessage ? failMessage + ' > ': '') + error, result);
  };
  var onSuccess = function(error, result) {
    if (successCb) {
      successCb(result, onFail);
    } else {
      onFail(error, result);
    }
  };
  return function(error, result) {
    if (error) {
      onFail(error, result);
    } else {
      onSuccess(error, result);
    }
  };
};

// Checks for required fields and parses out optional fields
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
  if (validatedEntry.email && !validatedEntry.photo) {
    validatedEntry.photo = 'http://www.gravatar.com/avatar/' + md5.digest_s(validatedEntry.email);
  }
  // Defaults the default member to the admin
  if (validatedEntry.admin_id && !validatedEntry.default_id) {
    validatedEntry.default_id = validatedEntry.admin_id;
  }
  return validatedEntry;
};

// Validates against possible fields
var getEntryFields = function(entry, possibleEntryFields) {
  if (!entry) {
    return [];
  }
  return possibleEntryFields.filter(function(field) { return entry[field] !== undefined; });
};

// Sets up database connection and queries entry
// Params has properties entry, entryFields, queryString, callback, and success
// Helper function for addEntry and getEntry
var connect = function(params) {
  pg.connect(config, function(error, client, done) {
    if (error) {
      return augmentCb(params.callback, 'failed database request')(error);
    }

    var entryFieldStrings = params.entryFields.map(function(entryField) {
      return entryField.join(',');
    });

    // Creates outer scope paramIndex so entryFields' index counts don't reset
    var paramIndex = 1;
    var parameters = params.entryFields.map(function(entryField) {
      return '$'+entryField.map(function() {
        return paramIndex++;
      }).join(',$');
    });

    var entryFieldValues = params.entryFields.map(function(entryField) {
      return entryField.map(function(current) {
        return params.entry[current] || null;
      });
    }).reduce(function(memo, current) {
      return memo.concat(current);
    }, []);

    client.query(params.queryString(entryFieldStrings, parameters), entryFieldValues, function(error, result) {
      if (error) {
        done(client);
        return augmentCb(params.callback, 'failed client request')(error);
      }
      done();
      params.success(result, params.callback);
    });
  });
};

// Helper function for addUser and addOrg
var addEntry = function(type, entry, cb) {
  entry = augmentFields(entry, allFields[type]);
  if (!entry) {
    return cb('required fields missing');
  }
  var fields = allFields[type].required.concat(allFields[type].optional);
  var insertString = function(entryFieldStrings, parameters) {
    return 'INSERT INTO '+type+'s ('+entryFieldStrings[0]+') VALUES ('+parameters[0]+') RETURNING *';
  };
  var success = function(result, cb) {
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

// Helper function for updateUser and updateOrg
// Uses id field attached to entry to update the rest
var updateEntry = function(type, entry, cb) {
  // Validates against possible fields
  var fields = getEntryFields(entry, allFields[type].required.concat(allFields[type].optional));
  if (!entry.id) {
    return cb('id field missing');
  }

  var updateString = function(entryFieldStrings, parameters) {
    return 'UPDATE '+type+'s SET ('+entryFieldStrings[0]+',updated_at) = ('+parameters[0]+',DEFAULT) WHERE ('+entryFieldStrings[1]+') = ('+parameters[1]+') RETURNING *';
  };
  var success = function(result, cb) {
    if (result.rows.length) {
      cb(null, result.rows[0]);
    } else {
      cb('no matches');
    }
  };
  connect({
    entry: entry,
    entryFields: [fields, ['id']],
    queryString: updateString,
    callback: cb,
    success: success
  });
};

// Helper function for getUsers and getOrgs
var getEntries = function(type, entry, cb) {
  // Validates against possible fields
  var fields = getEntryFields(entry, allFields[type].required.concat(allFields[type].optional, allFields[type].auto));
  if (!fields.length) {
    return cb('no fields supplied');
  }

  var selectString = function(entryFieldStrings, parameters) {
    return 'SELECT * FROM '+type+'s WHERE ('+entryFieldStrings[0]+') = ('+parameters[0]+')';
  };
  var success = function(result, cb) {
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

// Helper function for deleteUser and deleteOrg
// Uses id field attached to entry to delete the entry
var deleteEntry = function(type, entry, cb) {
  var fields = ['id'];
  if (!entry.id) {
    return cb('id field missing');
  }

  var deleteString = function(entryFieldStrings, parameters) {
    return 'DELETE FROM '+type+'s WHERE ('+entryFieldStrings[0]+') = ('+parameters[0]+') RETURNING *';
  };
  var success = function(result, cb) {
    if (result.rows.length) {
      cb(null, result.rows[0]);
    } else {
      cb('no matches');
    }
  };
  connect({
    entry: entry,
    entryFields: [fields],
    queryString: deleteString,
    callback: cb,
    success: success
  });
};

// Helper function for getUser and getOrg
var getEntry = function(type, entry, cb) {
  var rejectIfMultiple = function(users, cb) {
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
exports.addOrg = function(organization, cb) {
  var updateUser = function( organization, cb) {
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
exports.updateOrg = function(organization, cb) {
  updateEntry('organization', organization, augmentCb(cb, 'updating organization'));
};

// Takes a user entry and deletes it
exports.deleteUser = function(user, cb) {
  deleteEntry('user', user, augmentCb(cb, 'deleting user'));
};

// Takes an organization entry and deletes it
exports.deleteOrg = function(organization, cb) {
  deleteEntry('organization', organization, augmentCb(cb, 'deleting organization'));
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
exports.getOrg = function(organization, cb) {
  getEntry('organization', organization, augmentCb(cb, 'getting organization'));
};

// Takes partial organization fields and returns organization entries
exports.getOrgs = function(organizations, cb) {
  getEntries('organization', organizations, augmentCb(cb, 'getting organizations'));
};

// Takes an organization and retrieves all users belonging to it
// Attaches the users array as the property users and returns the organization
exports.getUsersByOrg = function(organization, cb) {
  var getUsers = function(organization, cb) {
    var buildOrgInfo = function(users, cb) {
      organization.members = users;
      cb(null, organization);
    };
    exports.getUsers({organization_id: organization.id}, augmentCb(cb, null, buildOrgInfo));
  };
  exports.getOrg(organization, augmentCb(cb, 'getting users by organization', getUsers));
};

// Takes a user and retrieves all users that share an organization
// Attaches the users array as the property users and returns the organization
exports.getUsersShareOrg = function(user, cb) {
  var getUsersByOrg = function(user, cb) {
    if (!user.organization_id) {
      cb(null, {});
    } else {
      exports.getUsersByOrg({id: user.organization_id}, augmentCb(cb, 'getting users that share organization'));
    }
  };
  exports.getUser(user, augmentCb(cb, 'getting users share organization', getUsersByOrg));
};

var schemaCache; // Caches the schema to prevent multiple file reads during testing
exports.clearDb = function(config, cb) {
  config = config || process.env.DATABASE_TEST_URL || require('../config/config').testdb.config;
  if (config === process.env.DATABASE_URL || (!process.env.DATABASE_URL && config.database && config.database === require('../config/config').proddb.config.database)) {
    cb('do not clear the production database');
  } else {
    var clear = function(schema) {
      pg.connect(config, function(error, client, pgDone) {
        if (error) {
          return cb('Error: failed database request - ' + error);
        }
        client.query(schema.toString(), function(error, result) {
          if (error) {
            pgDone(client);
            return cb('Error: failed client request - ' + error);
          }
          pgDone();
          cb(null);
        });
      });
    };
    if (schemaCache) {
      return clear(schemaCache);
    }
    fs.readFile(__dirname+'/dbSchema.sql', function(error, text) {
      if (error) {
        return cb('Error: failed to read schema - ' + error);
      }
      clear(schemaCache = text);
    });
  }
};
