// Remember old information to revert afterwards
var oldInfo = {
  PORT: process.env.PORT,
  TEST: process.env.TEST
};

// Change some environmental variables before starting tests
// On dev machines, allow this to run concurrently with the server (on another port)
// On production machines, test before running the server
if (!process.env.PORT) {
  process.env.PORT = 55987;
}
process.env.TEST = true;

var chai = require('chai');
var expect = chai.expect;

describe('apiRouter', function() {
  this.timeout(10000);

  var http = require('http');
  var app = require('../../../server/app');
  var Promise = require('bluebird');
  var dbUtils = require('../../../server/db/dbUtils');
  var config = process.env.DATABASE_TEST_URL || require('../../../server/config/config').testdb.config;

  // Promise-returning request with session
  var reqAsync = Promise.promisify(require('request').defaults({jar: true}));
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
          first_name: 'Bryan',
          last_name: 'Bryan',
          email: 'bryan@bry.an',
          password: 'bryan'
        }
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('creates an organization', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/orgs/',
        json: {
          name: 'Bryan\'s',
          logo: 'halo.jpg',
          welcome_message: 'Bryan\'s Bryan Bryan Bryans Bryanly'
        }
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('adds a user', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/users/',
        json: {
          first_name: 'Bryan\'s',
          last_name: 'Evil Twin',
          email: 'bryan@br.yan',
          title: 'Or Is This The Good One?'
        }
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('updates a user', function(done) {
      var options = {
        method: 'PUT',
        uri: url+'api/users/2',
        json: {
          last_name: 'Good Twin'
        }
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('updates an organization', function(done) {
      var options = {
        method: 'PUT',
        uri: url+'api/orgs/',
        json: {
          logo: 'pitchfork.jpg',
          default_id: '2'
        }
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        done();
      });
    });
    it('retrieves updated values', function(done) {
      var options = {
        method: 'GET',
        uri: url+'api/orgs/dashboard'
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        body = JSON.parse(body);
        expect(body.name).to.equal('Bryan\'s');
        expect(body.logo).to.equal('pitchfork.jpg');
        expect(body.admin_id).to.equal(1);
        expect(body.default_id).to.equal(2);
        expect(body.members[1].first_name).to.equal('Bryan\'s');
        expect(body.members[1].last_name).to.equal('Good Twin');
        expect(body.members[1].password_hash).to.equal(undefined);
        done();
      });
    });
    it('deletes users', function(done) {
      var options = {
        method: 'DELETE',
        uri: url+'api/users/2'
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var options = {
          method: 'GET',
          uri: url+'api/orgs/dashboard'
        };
        return reqAsync(options);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // User Error
        body = JSON.parse(body);
        expect(body.members.length).to.equal(1);
        expect(body.default_id).to.equal(body.admin_id);
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
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var options = {
          method: 'GET',
          uri: url+'api/orgs/dashboard'
        };
        return reqAsync(options);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User Error
        done();
      });
    });
    it('fails to retrieve sensitive fields', function(done) {
      var options = {
        method: 'GET',
        uri: url+'api/orgs/client'
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // User Error
        body = JSON.parse(body);
        expect(body.members[0].last_name).to.equal('Bryan');
        expect(body.members[0].password_hash).to.equal(undefined);
        expect(body.members[0].email).to.equal(undefined);
        done();
      });
    });
    it('throws an error if user is logged out', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/logout'
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var options = {
          method: 'GET',
          uri: url+'api/orgs/client'
        };
        return reqAsync(options);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error
        done();
      });
    });
    it('throws an error if updating from another account', function(done) {
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
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var options = {
          method: 'PUT',
          uri: url+'api/users/1',
          json: {
            title: 'Not-At-All Evil'
          }
        };
        return reqAsync(options);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error
        done();
      });
    });
    it('throws an error if deleting from another account', function(done) {
      var options = {
        method: 'DELETE',
        uri: url+'api/users/1'
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error
        done();
      });
    });
    it('throws an error if updating an unaffiliated user as an org\'s default', function(done) {
      var options = {
        method: 'POST',
        uri: url+'api/orgs/',
        json: {
          name: 'Cult of Bryan',
          logo: 'rosary.png',
          welcome_message: 'All hail Bryan'
        }
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var options = {
          method: 'PUT',
          uri: url+'api/orgs/',
          json: {
            default_id: '1'
          }
        };
        return reqAsync(options);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // Success
        done();
      });
    });
    it('throws an error if deleting self as admin', function(done) {
      var options = {
        method: 'DELETE',
        uri: url+'api/users/3'
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error
        done();
      });
    });
    it('deletes an organization', function(done) {
      var options = {
        method: 'DELETE',
        uri: url+'api/orgs/'
      };
      reqAsync(options).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/);
        var options = {
          method: 'GET',
          uri: url+'api/orgs/dashboard'
        };
        return reqAsync(options);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/);
        expect(body).to.equal('{}');
        done();
      });
    });
  });
});
