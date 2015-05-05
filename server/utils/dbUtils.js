var pg = require('pg');
var _ = require('underscore');
var config = process.env.DATABASE_URL || require('../config/config').testdb.config;

// Add user
// Add organization
// Update user
// Update organization
// Retrieve user email and phone number
// Retrieve user
// Retrieve organization

// TODO: Support update user, update organization

var allUserFields = {
  required: ['first_name', 'last_name', 'email'],
  optional: ['organization_id', 'middle_name', 'password_hash', 'phone', 'photo', 'department', 'title'],
  auto: ['id', 'created_at', 'updated_at'],
};

var defaultCb = function(err) {
  console.error(err);
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
  user = augmentFields(user, allUserFields);
  cb = cb || defaultCb;
  if (!user) {
    return cb('Error adding user: required field missing');
  }
  pg.connect(config, function(err, client, done) {
    if (err) {
      return cb('Error adding user: failed database request - ' + err);
    }
    var userFields = allUserFields.required.concat(allUserFields.optional);
    var userFieldString = userFields.join(',');
    var parameters = '$'+userFields.map(function(current, index) {return index+1;}).join(',$');
    var userFieldValues = userFields.map(function(current) {return user[current];});
    client.query('INSERT INTO users ('+userFieldString+') VALUES ('+parameters+')', userFieldValues, function(err, result) {
      if (err) {
        done(client);
        return cb('Error adding user: failed client request - ' + err);
      }
      done();
      cb(null);
    });
  });
};

// Takes partial user fields and returns user entry
exports.getUser = function(entry, cb) {
  cb = cb || defaultCb;
  if (!entry) {
    return cb('Error getting user: no fields supplied');
  }

  // Validate against possible fields
  var userFields = [];
  var possibleUserFields = allUserFields.required.concat(allUserFields.optional, allUserFields.auto);
  for (var i=0; i<possibleUserFields.length; i++) {
    if (entry[possibleUserFields[i]]) {
      userFields.push(possibleUserFields[i]);
    }
  }
  if (!userFields.length) {
    return cb('Error getting user: no fields supplied');
  }

  pg.connect(config, function(err, client, done) {
    if (err) {
      return cb('Error getting user: failed database request - ' + err);
    }
    var userFieldString = userFields.join(',');
    var parameters = '$'+userFields.map(function(current, index) {return index+1;}).join(',$');
    var userFieldValues = userFields.map(function(current) {return entry[current];});
    client.query('SELECT * FROM users WHERE ('+userFieldString+') = ('+parameters+')', userFieldValues, function(err, result) {
      if (err) {
        done(client);
        return cb('Error getting user: failed client request - ' + err);
      }
      done();
      if (result.rows.length > 1) {
        cb('Error getting user: multiple user matches');
      } else if (result.rows.length) {
        cb(null, result.rows[0]);
      } else {
        cb('Error getting user: no user matches');
      }
    });
  });
};
