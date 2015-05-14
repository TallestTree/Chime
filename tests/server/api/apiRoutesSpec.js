// Remember old information to revert afterwards
var oldInfo = {
  PORT: process.env.PORT,
  TEST: process.env.TEST
};

// Change some environmental variables before starting tests
// On dev machines, allow this to run concurrently with the server
// On production machines, test before running the server
if (!process.env.PORT) {
  process.env.PORT = 55987;
}
process.env.TEST = true;

var chai = require('chai');
var expect = chai.expect;

describe('apiRoutes', function() {
  this.timeout(30000);

  var http = require('http');
  var app = require('../../../server/app');
  var dbUtils = require('../../../server/utils/dbUtils/dbUtils');
  var config = process.env.DATABASE_TEST_URL || require('../../../server/config/config').testdb.config;

  var requestWithSession = require('request').defaults({jar: true});
  var instance;
  var url = 'http://localhost:'+process.env.PORT+'/';

  before(function(done) {
    instance = http.createServer(app).listen(process.env.PORT);
    instance.on('listening', function() {
      console.log('Listening');
      dbUtils._clearDb(config, done);
    });
  });
  after(function() {
    instance.close();
    // process.env properties are coerced into strings so delete these to stop string 'undefined'
    if (!oldInfo.PORT) {
      delete process.env.PORT;
    }
    if (oldInfo.TEST) {
      process.env.TEST = oldInfo.TEST;
    } else {
      delete process.env.TEST;
    }
    console.log('Stopped');
  });
  describe('adds and updates users and organizations', function() {
    it('creates an account', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/signup',
        json: {
          first_name: 'bryan',
          last_name: 'bryan',
          email: 'bryan@bry.an',
          password: 'bryan'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('creates an organization', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/orgs/add',
        json: {
          name: 'Bryan\'s',
          logo: 'halo.jpg',
          welcome_message: 'Bryan\'s Bryan Bryan Bryans Bryanly'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('adds a user', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/users/add',
        json: {
          first_name: 'Bryan\'s',
          last_name: 'Evil Twin',
          email: 'bryan@br.yan',
          title: 'Or Is This The Good One?'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('updates a user', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/users/update',
        json: {
          id: 2,
          last_name: 'Good Twin'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('updates an organization', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/orgs/update',
        json: {
          logo: 'pitchfork.jpg'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('retrieves updated values', function(done) {
      var options = {
        method: 'GET',
        uri: url+'api/orgs/dashboard'
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        body = JSON.parse(body);
        expect(body.name).to.equal('Bryan\'s');
        expect(body.logo).to.equal('pitchfork.jpg');
        expect(body.members[1].first_name).to.equal('Bryan\'s');
        expect(body.members[1].last_name).to.equal('Good Twin');
        expect(body.members[1].password_hash).to.equal(undefined);
        done();
      });
    });
  });
  describe('throws an error if permissions are insufficient', function() {
    it('throws an error if user is in client mode', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/client-login'
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var options = {
          method: 'GET',
          uri: url+'api/orgs/dashboard'
        };
        requestWithSession(options, function(error, res, body) {
          expect(error).to.equal(null);
          expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User Error
          done();
        });
      });
    });
    it('fails to retrieve sensitive fields', function(done) {
      var options = {
        method: 'GET',
        uri: url+'api/orgs/client'
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // User Error
        body = JSON.parse(body);
        expect(body.members[1].last_name).to.equal('Good Twin');
        expect(body.members[1].password_hash).to.equal(undefined);
        expect(body.members[1].email).to.equal(undefined);
        done();
      });
    });
    it('throws an error if user is logged out', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/logout'
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var options = {
          method: 'GET',
          uri: url+'api/orgs/client'
        };
        requestWithSession(options, function(error, res, body) {
          expect(error).to.equal(null);
          // expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error // TODO: Re-add when isClientLoggedIn is supported
          done();
        });
      });
    });
    it('throws an error if user is logged in to another account', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/signup',
        json: {
          first_name: 'notbryan',
          last_name: 'notbryan',
          email: 'not@bry.an',
          password: 'bryan'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(error).to.equal(null);
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var options = {
          method: 'POST',
          uri: url+'api/users/update',
          json: {
            id: 1,
            title: 'Not-At-All Evil'
          }
        };
        requestWithSession(options, function(error, res, body) {
          expect(error).to.equal(null);
          expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error
          done();
        });
      });
    });
  });
});
