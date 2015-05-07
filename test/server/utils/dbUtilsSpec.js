var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
var rewire = require('rewire');

describe('dbUtils', function() {
  this.timeout(3000);
  var pg = require('pg');
  var dbUtils = rewire('../../../server/utils/dbUtils');
  var config = process.env.TEST_DB_URL || require('../../../server/config/config').testdb.config;

  // // For testing on localhost instead (if postgres is installed)
  // config = {
  //   user: 'myuser',
  //   database: 'mydb',
  //   password: 'test',
  //   port: 5432,
  //   host: 'localhost'
  // };

  var john = {first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com', phone: 5551234567};
  var jane = {first_name: 'Jane', last_name: 'Doe', email: 'janedoe@myurl.com', phone: 5551234567};
  var tallestTree = {name: 'Tallest Tree', admin_id: 1};

  dbUtils.__set__('config', config);

  beforeEach(function(testDone) {
    this.timeout(10000);
    // Clears the database via dbSchema.sql
    var fs = require('fs');
    var schema = fs.readFileSync(__dirname+'/../../../server/utils/dbSchema.sql').toString();
    pg.connect(config, function(err, client, pgDone) {
      if (err) {
        return console.error('Error: failed database request - ' + err);
      }
      client.query(schema, function(err, result) {
        if (err) {
          pgDone(client);
          return console.error('Error: failed client request - ' + err);
        }
        pgDone();
        testDone();
      });
    });
  });

  describe('adds and retrieves a user', function() {
    it('adds a user', function(testDone) {
      dbUtils.addUser(john, function(err, user) {
        expect(err).to.equal(null);
        pg.connect(config, function(err, client, pgDone) {
          if (err) {
            return console.error('Error: failed database request - ' + err);
          }
          client.query('SELECT * FROM users', function(err, result) {
            if (err) {
              pgDone(client);
              return console.error('Error: failed client request - ' + err);
            }
            expect(result.rows.length).to.equal(1);
            expect(result.rows[0].first_name).to.equal('John');
            expect(result.rows[0].last_name).to.equal('Doe');
            pgDone();
            testDone();
          });
        });
      });
    });
    it('assigns unique ids to users', function(testDone) {
      dbUtils.addUser({first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com'}, function(err, user) {
        expect(err).to.equal(null);
        expect(user.id).to.equal(1);
        dbUtils.addUser({first_name: 'Jane', last_name: 'Doe', email: 'janedoe@myurl.com'}, function(err, user) {
          expect(err).to.equal(null);
          expect(user.id).to.equal(2);
          testDone();
        });
      });
    });
    it('grabs a user by id', function(testDone) {
      dbUtils.addUser(jane, function(err, user) {
        expect(err).to.equal(null);
        dbUtils.getUser({id: 1}, function(err, user) {
          expect(err).to.equal(null);
          expect(user.email).to.equal('janedoe@myurl.com');
          expect(user.phone).to.equal('5551234567');
          testDone();
        });
      });
    });
    it('grabs a user by name', function(testDone) {
      dbUtils.addUser(john, function(err) {
        expect(err).to.equal(null);
        dbUtils.getUser({first_name: 'John', last_name: 'Doe'}, function(err, result) {
          expect(err).to.equal(null);
          expect(result.email).to.equal('johndoe@myurl.com');
          expect(result.phone).to.equal('5551234567');
          testDone();
        });
      });
    });
  });
  describe('it errors on invalid users', function() {
    it('throws an error if a required field is missing', function(testDone) {
      dbUtils.addUser({first_name: 'Jane', last_name: 'Doe'}, function(err) {
        expect(err).to.not.equal(null);
        testDone();
      });
    });
    it('throws an error if a unique field is inserted twice', function(testDone) {
      dbUtils.addUser(john, function(err, id) {
        expect(err).to.equal(null);
        dbUtils.addUser(jane, function(err) {
          expect(err).to.not.equal(null);
          testDone();
        });
      });
    });
    it('throws an error if update does not match any entries', function(testDone) {
      dbUtils.updateUser(john, function(err, user) {
        expect(err).to.not.equal(null);
        testDone();
      });
    });
  });
  describe('adds and retrieves an organization', function() {
    it('adds an organization', function(testDone) {
      dbUtils.addUser(jane, function(err, user) {
        expect(err).to.equal(null);
        dbUtils.addOrganization(tallestTree, function(err, organization) {
          expect(err).to.equal(null);
          expect(organization.id).to.equal(1);
          pg.connect(config, function(err, client, pgDone) {
            if (err) {
              return console.error('Error: failed database request - ' + err);
            }
            client.query('SELECT * FROM organizations', function(err, result) {
              if (err) {
                pgDone(client);
                return console.error('Error: failed client request - ' + err);
              }
              expect(result.rows.length).to.equal(1);
              expect(result.rows[0].name).to.equal('Tallest Tree');
              expect(result.rows[0].admin_id).to.equal(1);
              pgDone();
              testDone();
            });
          });
        });
      });
    });
    it('grabs an organization by name', function(testDone) {
      dbUtils.addUser(jane, function(err) {
        expect(err).to.equal(null);
        dbUtils.addOrganization(tallestTree, function(err) {
          expect(err).to.equal(null);
          dbUtils.getOrganization({name: 'Tallest Tree'}, function(err, organization) {
            expect(err).to.equal(null);
            expect(organization.name).to.equal('Tallest Tree');
            testDone();
          });
        });
      });
    });
  });
  describe('it updates users and organizations', function() {
    it('updates users', function(testDone) {
      dbUtils.addUser(john, function(err) {
        expect(err).to.equal(null);
        dbUtils.updateUser({email: 'johndoe@myurl.com', first_name: 'Jane'}, function(err, user) {
          expect(err).to.equal(null);
          expect(user.first_name).to.equal('Jane');
          expect(user.last_name).to.equal('Doe');
          testDone();
        });
      });
    });
    it('updates an admin\'s organization', function(testDone) {
      dbUtils.addUser(john, function(err, user) {
        expect(err).to.equal(null);
        dbUtils.addOrganization(tallestTree, function(err, organization) {
          expect(err).to.equal(null);
          dbUtils.getUser(john, function(err, user) {
            expect(err).to.equal(null);
            expect(user.organization_id).to.equal(organization.id);
            testDone();
          });
        });
      });
    });
  });
  describe('it updates entries', function() {
    it('updates admin when adding an organization', function(testDone) {
      dbUtils.addUser(john, function(err) {
        expect(err).to.equal(null);
        dbUtils.addOrganization(tallestTree, function(err, user) {
          expect(err).to.equal(null);
          dbUtils.getUser(john, function(err, user) {
            expect(err).to.equal(null);
            expect(user.organization_id).to.equal(1);
            testDone();
          });
        });
      });
    });
    it('updates updated_at when updating', function(testDone) {
      dbUtils.addUser(john, function(err, user) {
        expect(err).to.equal(null);
        expect(user.updated_at.getTime()).to.equal(user.created_at.getTime());
        dbUtils.updateUser({email: 'johndoe@myurl.com', first_name: 'Jane'}, function(err, user) {
          expect(err).to.equal(null);
          expect(user.first_name).to.equal('Jane');
          expect(user.updated_at.getTime()).to.not.equal(user.created_at.getTime());
          testDone();
        });
      });
    });
  });
  describe('it fetches multiple users', function() {
    it('gets users by organization', function(testDone) {
      dbUtils.addUser(jane, function(err) {
        expect(err).to.equal(null);
        dbUtils.addOrganization(tallestTree, function(err, user) {
          expect(err).to.equal(null);
          dbUtils.addUser({first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com', phone: 5551234568, organization_id: 1}, function(err, user) {
            expect(err).to.equal(null);
            dbUtils.getUsersByOrganization({id: 1}, function(err, users) {
              expect(err).to.equal(null);
              expect(users.length).to.equal(2);
              expect(users[0].first_name).to.equal('Jane');
              expect(users[1].first_name).to.equal('John');
              testDone();
            });
          });
        });
      });
    });
    it('gets users that share an organization', function(testDone) {
      dbUtils.addUser(jane, function(err) {
        expect(err).to.equal(null);
        dbUtils.addOrganization(tallestTree, function(err, user) {
          expect(err).to.equal(null);
          dbUtils.addUser({first_name: 'John', last_name: 'Doe', email: 'johndoe@myurl.com', phone: 5551234568, organization_id: 1}, function(err, user) {
            expect(err).to.equal(null);
            dbUtils.getUsersShareOrganization(jane, function(err, users) {
              expect(err).to.equal(null);
              expect(users.length).to.equal(2);
              expect(users[0].first_name).to.equal('Jane');
              expect(users[1].first_name).to.equal('John');
              testDone();
            });
          });
        });
      });
    });
    it('throws an error if user is not in an organization', function(testDone) {
      dbUtils.addUser(jane, function(err) {
        expect(err).to.equal(null);
        dbUtils.getUsersShareOrganization(jane, function(err, users) {
          expect(err).to.not.equal(null);
          testDone();
        });
      });
    });
  });
});
