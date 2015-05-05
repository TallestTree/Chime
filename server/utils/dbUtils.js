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

var userFields = {
  required: ['first_name', 'last_name'],
  optional: ['organization_id', 'username', 'middle_name', 'password_hash', 'phone', 'email', 'photo', 'department', 'title']
};
userFields.all = userFields.required.concat(userFields.optional);

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
  user = augmentFields(user, userFields);
  cb = cb || defaultCb;
  if (!user) {
    return cb('Error adding user: required field missing');
  }
  pg.connect(config, function(err, client, done) {
    if (err) {
      return cb('Error adding user: failed database request - ' + err);
    }
    var parameters = '$'+userFields.all.map(function(current, index) {return index+1;}).join(',$');
    var userFieldValues = userFields.all.map(function(current) {return user[current];});
    client.query('INSERT INTO users ('+userFields.all.join(',')+') VALUES ('+parameters+')', userFieldValues, function(err, result) {
      if (err) {
        done(client);
        return cb('Error adding user: failed client request - ' + err);
      }
      done();
      cb(null);
    });
  });
};

// Takes a user id and returns user entry
exports.getUser = function(id, cb) {
  cb = cb || defaultCb;
  if (!id) {
    return cb('Error getting user: id missing');
  }
  pg.connect(config, function(err, client, done) {
    if (err) {
      return cb('Error getting user: failed database request - ' + err);
    }
    client.query('SELECT * FROM users where id=$1', [id], function(err, result) {
      if (err) {
        done(client);
        return cb('Error getting user: failed client request - ' + err);
      }
      done();
      cb(null, result.rows[0]);
    });
  });
};
