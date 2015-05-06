var pg = require('pg');
var _ = require('underscore');
var config = process.env.DATABASE_URL || require('../config/config').testdb.config;

// Add organization
// Update user
// Update organization
// Retrieve organization

// TODO: Support update user, update organization

var allFields = {
  user: {
    required: ['first_name', 'last_name', 'email'],
    optional: ['organization_id', 'middle_name', 'password_hash', 'phone', 'photo', 'department', 'title'],
    auto: ['id', 'created_at', 'updated_at']
  },
  organization: {
    required: ['admin_id', 'name'],
    optional: ['logo', 'welcome_message'],
    auto: ['id', 'created_at', 'updated_at']
  }
};

var augmentCb = function(cb, prepend) {
  cb = cb || function(err) {
    console.error(err);
  };
  return function(err) {
    if (err) {
      err = 'Error ' + prepend + ' - ' + err;
    }
    cb.apply(null, arguments);
  };
};

// Checks for required fields and replaces missing optional fields with null
var augmentFields = function(entry, fields) {
  entry = entry || {};
  fields = fields || {};
  for (var i=0; i<fields.required.length; i++) {
    if (!entry[fields.required[i]]) {
      return null;
    }
  }
  for (var j=0; j<fields.optional.length; j++) {
    entry[fields.optional[j]] = entry[fields.optional[j]] || null;
  }
  return entry;
};

// Takes a user entry and adds it
exports.addUser = function(user, cb) {
  user = augmentFields(user, allFields.user);
  cb = augmentCb(cb, 'adding user');
  if (!user) {
    return cb('required field missing');
  }
  pg.connect(config, function(err, client, done) {
    if (err) {
      return cb('failed database request - ' + err);
    }
    var userFields = allFields.user.required.concat(allFields.user.optional);
    var userFieldString = userFields.join(',');
    var parameters = '$'+userFields.map(function(current, index) {return index+1;}).join(',$');
    var userFieldValues = userFields.map(function(current) {return user[current];});
    client.query('INSERT INTO users ('+userFieldString+') VALUES ('+parameters+')', userFieldValues, function(err, result) {
      if (err) {
        done(client);
        return cb('failed client request - ' + err);
      }
      done();
      cb(null);
    });
  });
};

// Takes partial user fields and returns user entry
exports.getUser = function(entry, cb) {
  cb = augmentCb(cb, 'getting user');
  if (!entry) {
    return cb('no fields supplied');
  }

  // Validate against possible fields
  var userFields = [];
  var possibleUserFields = allFields.user.required.concat(allFields.user.optional, allFields.user.auto);
  for (var i=0; i<possibleUserFields.length; i++) {
    if (entry[possibleUserFields[i]]) {
      userFields.push(possibleUserFields[i]);
    }
  }
  // Check first time to see if entry exists, and second time to see if it has valid fields
  if (!userFields.length) {
    return cb('no fields supplied');
  }

  pg.connect(config, function(err, client, done) {
    if (err) {
      return cb('failed database request - ' + err);
    }
    var userFieldString = userFields.join(',');
    var parameters = '$'+userFields.map(function(current, index) {return index+1;}).join(',$');
    var userFieldValues = userFields.map(function(current) {return entry[current];});
    client.query('SELECT * FROM users WHERE ('+userFieldString+') = ('+parameters+')', userFieldValues, function(err, result) {
      if (err) {
        done(client);
        return cb('failed client request - ' + err);
      }
      done();
      if (result.rows.length > 1) {
        cb('multiple user matches');
      } else if (result.rows.length) {
        cb(null, result.rows[0]);
      } else {
        cb('no user matches');
      }
    });
  });
};

// Takes an organization entry and adds it
exports.addOrganization = function(organization, cb) {
  organization = augmentFields(organization, allFields.organization);
  cb = augmentCb(cb, 'adding organization');
  if (!organization) {
    return cb('required field missing');
  }
  pg.connect(config, function(err, client, done) {
    if (err) {
      return cb('failed database request - ' + err);
    }
    var organizationFields = allFields.organization.required.concat(allFields.organization.optional);
    var organizationFieldString = organizationFields.join(',');
    var parameters = '$'+organizationFields.map(function(current, index) {return index+1;}).join(',$');
    var organizationFieldValues = organizationFields.map(function(current) {return organization[current];});
    client.query('INSERT INTO organizations ('+organizationFieldString+') VALUES ('+parameters+')', organizationFieldValues, function(err, result) {
      if (err) {
        done(client);
        return cb('failed client request - ' + err);
      }
      done();
      cb(null);
    });
  });
};
