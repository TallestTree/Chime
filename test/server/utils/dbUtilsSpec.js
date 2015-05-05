var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
var rewire = require('rewire');

describe('dbUtils', function() {
  var pg = require('pg');
  var dbUtils = rewire('../../../server/utils/dbUtils');
  var config = require('../../../server/config/config').testdb.config;

  // For testing on localhost instead (if postgres is installed)
  config = {
    user: 'myuser',
    database: 'mydb',
    password: 'test',
    port: 5432,
    host: 'localhost'
  };

  dbUtils.__set__('config', config);

  beforeEach(function(testDone) {
    this.timeout(5000);
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

  describe('dbUtils', function() {
    it('adds a user', function(testDone) {
      dbUtils.addUser({first_name: 'John', last_name: 'Doe'}, function(err) {
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
    it('throws an error if a required field is missing', function(testDone) {
      dbUtils.addUser({first_name: 'Jane'}, function(err) {
        expect(err.substring(0,5)).to.equal('Error');
        testDone();
      });
    });
    it('grabs a user\'s entry', function(testDone) {
      dbUtils.addUser({first_name: 'Jane', last_name: 'Doe', email: 'janedoe@myurl.com', phone: 5551234567}, function(err) {
        expect(err).to.equal(null);
        dbUtils.getUser(1, function(err, info) {
          expect(err).to.equal(null);
          expect(info.email).to.equal('janedoe@myurl.com');
          expect(info.phone).to.equal('5551234567');
          testDone();
        });
      });
    });
  });
});
