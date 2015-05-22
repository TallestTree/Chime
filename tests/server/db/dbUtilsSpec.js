var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');

describe('dbUtils', function() {
  this.timeout(10000);
  var Promise = require('bluebird');
  var pg = Promise.promisifyAll(require('pg'));
  var dbUtils = Promise.promisifyAll(rewire('../../../server/db/dbUtils'));
  var config = process.env.DATABASE_TEST_URL || require('../../../server/config/config').testdb.config;

  // Reference entries used multiple times
  var john = {first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com', phone: 5551234567};
  var jane = {first_name: 'Jane', last_name: 'Doe', email: 'janedoe@myurl.com', phone: 5551234567};
  var tallestTree = {name: 'Tallest Tree', admin_id: 1};

  dbUtils.__set__('config', config);

  beforeEach(function(done) {
    // Clears the database via dbSchema.sql
    dbUtils.clearDb(config, done);
  });

  after(function() {
    // Free up any open connections
    pg.end();
  });

  describe('adds and retrieves a user', function() {
    it('adds a user', function(done) {
      dbUtils.addUserAsync(john)
        .then(function() {
          return pg.connectAsync(config);
        }).spread(function(client, pgDone) {
          return Promise.promisify(client.query).bind(client)('SELECT * FROM users')
            .then(function(result) {
              pgDone();
              expect(result.rows.length).to.equal(1);
              expect(result.rows[0].first_name).to.equal('John');
              expect(result.rows[0].last_name).to.equal('Doe');
              done();
            }).catch(function(error) {
              pgDone(client);
              done(error);
            });
        }).catch(done);
    });
    it('assigns unique ids to users', function(done) {
      dbUtils.addUserAsync({first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com'})
        .then(function(user) {
          expect(user.id).to.equal(1);
          return dbUtils.addUserAsync(jane);
        }).then(function(user) {
          expect(user.id).to.equal(2);
          done();
        }).catch(done);
    });
    it('grabs a user by id', function(done) {
      dbUtils.addUserAsync(jane)
        .then(function() {
          return dbUtils.getUserAsync({id: 1});
        }).then(function(user) {
          expect(user.email).to.equal('janedoe@myurl.com');
          expect(user.phone).to.equal('5551234567');
          done();
        }).catch(done);
    });
    it('autofills a photo', function(done) {
      dbUtils.addUserAsync(jane)
        .then(function() {
          return dbUtils.getUserAsync({id: 1});
        }).then(function(user) {
          expect(user.email).to.equal('janedoe@myurl.com');
          expect(user.photo).to.not.equal(null);
          done();
        }).catch(done);
    });
  });
  describe('errors on invalid users', function() {
    it('throws an error if a required field is missing', function(done) {
      dbUtils.addUserAsync({first_name: 'Jane', last_name: 'Doe'})
        .then(function() { done(new Error('No error thrown')); })
        .catch(function() { done(); });
    });
    it('throws an error if a unique field is inserted twice', function(done) {
      dbUtils.addUserAsync(john)
        .then(function() {
          return dbUtils.addUserAsync({first_name: 'Jane', last_name: 'Doe', email: 'johndoe@myurl.com'}) // Email collision
            .then(function() { done(new Error('No error thrown')); })
            .catch(function() { done(); });
        });
    });
    it('throws an error if update does not match any entries', function(done) {
      dbUtils.updateUserAsync(john)
        .then(function() { done(new Error('No error thrown')); })
        .catch(function() { done(); });
    });
  });
  describe('adds and retrieves an organization', function() {
    it('adds an organization', function(done) {
      dbUtils.addUserAsync(jane)
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
              done();
            }).catch(function(error) {
              pgDone(client);
              done(error);
            });
        }).catch(done);
    });
    it('grabs an organization by name', function(done) {
      dbUtils.addUserAsync(jane)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function() { return dbUtils.getOrgAsync({name: 'Tallest Tree'}); })
        .then(function(org) {
          expect(org.name).to.equal('Tallest Tree');
          done();
        }).catch(done);
    });
  });
  describe('updates users and organizations', function() {
    it('updates users', function(done) {
      dbUtils.addUserAsync(john)
        .then(function() { return dbUtils.updateUserAsync({id: 1, first_name: 'Jane', email: 'janedoe@myurl.com'}); })
        .then(function(user) {
          expect(user.email).to.equal('janedoe@myurl.com');
          expect(user.first_name).to.equal('Jane');
          expect(user.last_name).to.equal('Doe');
          done();
        }).catch(done);
    });
    it('updates an admin\'s organization', function(done) {
      dbUtils.addUserAsync(john)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function(org) {
          return dbUtils.getUserAsync(john)
            .then(function(user) {
              expect(user.organization_id).to.equal(org.id);
              done();
            });
        }).catch(done);
    });
  });
  describe('updates entries', function() {
    it('updates admin when adding an organization', function(done) {
      dbUtils.addUserAsync(john)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function() { return dbUtils.getUserAsync(john); })
        .then(function(user) {
          expect(user.organization_id).to.equal(1);
          done();
        }).catch(done);
    });
  });
  describe('fetches multiple users', function() {
    it('gets users by organization', function(done) {
      dbUtils.addUserAsync(jane)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function() { return dbUtils.addUserAsync({first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com', phone: 5551234567, organization_id: 1}); })
        .then(function() { return dbUtils.getUsersByOrgAsync({id: 1}); })
        .then(function(orgInfo) {
          expect(orgInfo.name).to.equal('Tallest Tree');
          expect(orgInfo.members.length).to.equal(2);
          expect(orgInfo.members[0].first_name).to.equal('Jane');
          expect(orgInfo.members[1].first_name).to.equal('John');
          done();
        }).catch(done);
    });
    it('gets users that share an organization', function(done) {
      dbUtils.addUserAsync(jane)
        .then(function() { return dbUtils.addOrgAsync(tallestTree); })
        .then(function() { return dbUtils.addUserAsync({first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com', phone: 5551234567, organization_id: 1}); })
        .then(function() { return dbUtils.getUsersShareOrgAsync(jane); })
        .then(function(orgInfo) {
          expect(orgInfo.name).to.equal('Tallest Tree');
          expect(orgInfo.members.length).to.equal(2);
          expect(orgInfo.members[0].first_name).to.equal('Jane');
          expect(orgInfo.members[1].first_name).to.equal('John');
          done();
        }).catch(done);
    });
    it('returns an empty object if user is not in an organization', function(done) {
      dbUtils.addUserAsync(jane)
        .then(function() { return dbUtils.getUsersShareOrgAsync(jane); })
        .then(function(orgInfo) {
          expect(orgInfo.name).to.equal(undefined);
          done();
        }).catch(done);
    });
  });
});
