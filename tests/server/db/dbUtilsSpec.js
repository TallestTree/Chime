var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');

var Promise = require('bluebird');
var pg = Promise.promisifyAll(require('pg'));
var dbUtils = Promise.promisifyAll(rewire('../../../server/db/dbUtils'));
var config = process.env.DATABASE_TEST_URL || require('../../../server/config/config').testdb.config;

dbUtils.__set__('config', config);

describe('dbUtils', function() {
  this.timeout(10000);

  // Reference entries used multiple times
  var john = {first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com', phone: 5551234567};
  var jane = {first_name: 'Jane', last_name: 'Doe', email: 'janedoe@myurl.com', phone: 5551234567};
  var tallestTree = {name: 'Tallest Tree', admin_id: 1};

  beforeEach(function() {
    // Clears the database via dbSchema.sql
    return dbUtils.clearDbAsync(config);
  });

  after(function() {
    // Free up any open connections
    pg.end();
  });

  describe('adds and retrieves a user', function() {
    it('adds a user', function() {
      return dbUtils.addUserAsync(john)
        .then(function() {
          return pg.connectAsync(config);
        }).spread(function(client, pgDone) {
          return Promise.promisify(client.query).bind(client)('SELECT * FROM users')
            .then(function(result) {
              pgDone();
              expect(result.rows.length).to.equal(1);
              expect(result.rows[0].first_name).to.equal('John');
              expect(result.rows[0].last_name).to.equal('Doe');
            }).catch(function(error) {
              pgDone(client);
              throw new Error(error.message || error);
            });
        });
    });
    it('assigns unique ids to users', function() {
      return dbUtils.addUserAsync({first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com'})
        .then(function(user) {
          expect(user.id).to.equal(1);
          return dbUtils.addUserAsync(jane);
        }).then(function(user) {
          expect(user.id).to.equal(2);
        });
    });
    it('grabs a user by id', function() {
      return dbUtils.addUserAsync(jane)
        .then(function() {
          return dbUtils.getUserAsync({id: 1});
        }).then(function(user) {
          expect(user.email).to.equal('janedoe@myurl.com');
          expect(user.phone).to.equal('5551234567');
        });
    });
    it('autofills a photo', function() {
      return dbUtils.addUserAsync(jane)
        .then(function() {
          return dbUtils.getUserAsync({id: 1});
        }).then(function(user) {
          expect(user.email).to.equal('janedoe@myurl.com');
          expect(user.photo).to.not.equal(null);
        });
    });
  });
  describe('errors on invalid users', function() {
    it('throws an error if a required field is missing', function() {
      return dbUtils.addUserAsync({first_name: 'Jane', last_name: 'Doe'})
        .then(function() { throw new Error('No error thrown'); }, function() {});
    });
    it('throws an error if a unique field is inserted twice', function() {
      return dbUtils.addUserAsync(john)
        .then(function() {
          return dbUtils.addUserAsync({first_name: 'Jane', last_name: 'Doe', email: 'johndoe@myurl.com'}) // Email collision
            .then(function() { throw new Error('No error thrown'); }, function() {});
        });
    });
    it('throws an error if update does not match any entries', function() {
      return dbUtils.updateUserAsync(john)
        .then(function() { throw new Error('No error thrown'); }, function() {});
    });
  });
  describe('adds and retrieves an organization', function() {
    it('adds an organization', function() {
      return dbUtils.addUserAsync(jane)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function(org) {
          expect(org.id).to.equal(1);
          return pg.connectAsync(config);
        }).spread(function(client, pgDone) {
          return Promise.promisify(client.query).bind(client)('SELECT * FROM organizations')
            .then(function(result) {
              pgDone();
              expect(result.rows.length).to.equal(1);
              expect(result.rows[0].name).to.equal('Tallest Tree');
              expect(result.rows[0].admin_id).to.equal(1);
              expect(result.rows[0].default_id).to.equal(1);
            }).catch(function(error) {
              pgDone(client);
              throw new Error(error.message || error);
            });
        });
    });
    it('grabs an organization by name', function() {
      return dbUtils.addUserAsync(jane)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function() { return dbUtils.getOrgAsync({name: 'Tallest Tree'}); })
        .then(function(org) {
          expect(org.name).to.equal('Tallest Tree');
        });
    });
  });
  describe('updates users and organizations', function() {
    it('updates users', function() {
      return dbUtils.addUserAsync(john)
        .then(function() { return dbUtils.updateUserAsync({id: 1, first_name: 'Jane', email: 'janedoe@myurl.com'}); })
        .then(function(user) {
          expect(user.email).to.equal('janedoe@myurl.com');
          expect(user.first_name).to.equal('Jane');
          expect(user.last_name).to.equal('Doe');
        });
    });
    it('updates an admin\'s organization', function() {
      return dbUtils.addUserAsync(john)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function(org) {
          return dbUtils.getUserAsync(john)
            .then(function(user) {
              expect(user.organization_id).to.equal(org.id);
            });
        });
    });
  });
  describe('updates entries', function() {
    it('updates admin when adding an organization', function() {
      return dbUtils.addUserAsync(john)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function() { return dbUtils.getUserAsync(john); })
        .then(function(user) {
          expect(user.organization_id).to.equal(1);
        });
    });
  });
  describe('fetches multiple users', function() {
    it('gets users by organization', function() {
      return dbUtils.addUserAsync(jane)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function() { return dbUtils.addUserAsync({first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com', phone: 5551234567, organization_id: 1}); })
        .then(function() { return dbUtils.getUsersByOrgAsync({id: 1}); })
        .then(function(orgInfo) {
          expect(orgInfo.name).to.equal('Tallest Tree');
          expect(orgInfo.members.length).to.equal(2);
          expect(orgInfo.members[0].first_name).to.equal('Jane');
          expect(orgInfo.members[1].first_name).to.equal('John');
        });
    });
    it('gets users that share an organization', function() {
      return dbUtils.addUserAsync(jane)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function() { return dbUtils.addUserAsync({first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com', phone: 5551234567, organization_id: 1}); })
        .then(function() { return dbUtils.getUsersShareOrgAsync(jane); })
        .then(function(orgInfo) {
          expect(orgInfo.name).to.equal('Tallest Tree');
          expect(orgInfo.members.length).to.equal(2);
          expect(orgInfo.members[0].first_name).to.equal('Jane');
          expect(orgInfo.members[1].first_name).to.equal('John');
        });
    });
    it('returns an empty object if user is not in an organization', function() {
      return dbUtils.addUserAsync(jane)
        .then(function() { return dbUtils.getUsersShareOrgAsync(jane); })
        .then(function(orgInfo) {
          expect(orgInfo.name).to.equal(undefined);
        });
    });
  });
});
