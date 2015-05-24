var chai = require('chai');
var expect = chai.expect;

var http = require('http');
var app = require('../../../server/app');
var Promise = require('bluebird');
var dbUtils = Promise.promisifyAll(require('../../../server/db/dbUtils'));
var config = process.env.DATABASE_TEST_URL || require('../../../server/config/config').testdb.config;
// Promise-returning request with session
  var reqAsync = Promise.promisify(require('request').defaults({jar: true}));

describe('apiRouter', function() {
  this.timeout(10000);

  var instance;
  var url = 'http://localhost:'+process.env.PORT+'/';

  // Methods that have no params
  var getOrgDashboard = {
    method: 'GET',
    uri: url+'api/orgs/dashboard'
  };
  var getOrgClient = {
    method: 'GET',
    uri: url+'api/orgs/client'
  };
  var clientLogin = {
    method: 'POST',
    uri: url+'api/client-login'
  };
  var logOut = {
    method: 'POST',
    uri: url+'api/logout'
  };

  before(function(done) {
    instance = http.createServer(app).listen(process.env.PORT);
    instance.on('listening', function() {
      console.log('Listening');
      done();
    });
  });
  after(function() {
    instance.close();
    console.log('Stopped');
  });
  beforeEach(function() {
    var signup = {
      method: 'POST',
      uri: url+'api/signup',
      json: {
        first_name: 'Bryan',
        last_name: 'Bryan',
        email: 'bryan@bry.an',
        password: 'bryan'
      }
    };
    var addOrg = {
      method: 'POST',
      uri: url+'api/orgs/',
      json: {
        name: 'Bryan\'s',
        logo: 'halo.jpg',
        welcome_message: 'Bryan\'s Bryan Bryan Bryans Bryanly'
      }
    };
    var addUser = {
      method: 'POST',
      uri: url+'api/users/',
      json: {
        first_name: 'Bryan\'s',
        last_name: 'Evil Twin',
        email: 'bryan@br.yan',
        title: 'Or Is This The Good One?'
      }
    };
    return dbUtils.clearDbAsync(config)
      .then(function() { return reqAsync(signup); })
      .then(function() { return reqAsync(addOrg); })
      .then(function() { return reqAsync(addUser); });
  });
  describe('adds and updates users and organizations', function() {
    it('creates an organization', function() {
      return reqAsync(getOrgDashboard).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var orgInfo = JSON.parse(body);
        expect(orgInfo.name).to.equal('Bryan\'s');
        expect(orgInfo.logo).to.equal('halo.jpg');
        expect(orgInfo.admin_id).to.equal(1);
        expect(orgInfo.default_id).to.equal(1);
        expect(orgInfo.members[1].first_name).to.equal('Bryan\'s');
        expect(orgInfo.members[1].last_name).to.equal('Evil Twin');
        expect(orgInfo.members[1].password_hash).to.equal(undefined);
      });
    });
    it('adds a user', function() {
      var addUser = {
        method: 'POST',
        uri: url+'api/users/',
        json: {
          first_name: 'Bryan\'s',
          last_name: 'Underling',
          email: 'under@ling',
          title: 'My Life for Bryan'
        }
      };
      return reqAsync(addUser).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        return reqAsync(getOrgDashboard);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var orgInfo = JSON.parse(body);
        expect(orgInfo.members[2].first_name).to.equal('Bryan\'s');
        expect(orgInfo.members[2].last_name).to.equal('Underling');
      });
    });
    it('updates a user', function() {
      var updateUser = {
        method: 'PUT',
        uri: url+'api/users/2',
        json: {
          last_name: 'Good Twin'
        }
      };
      return reqAsync(updateUser).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        return reqAsync(getOrgDashboard);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var orgInfo = JSON.parse(body);
        expect(orgInfo.members[1].first_name).to.equal('Bryan\'s');
        expect(orgInfo.members[1].last_name).to.equal('Good Twin');
      });
    });
    it('updates an organization', function() {
      var updateOrg = {
        method: 'PUT',
        uri: url+'api/orgs/',
        json: {
          logo: 'pitchfork.jpg',
          default_id: '2'
        }
      };
      return reqAsync(updateOrg).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        return reqAsync(getOrgDashboard);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var orgInfo = JSON.parse(body);
        expect(orgInfo.logo).to.equal('pitchfork.jpg');
        expect(orgInfo.default_id).to.equal(2);
      });
    });
    it('deletes users', function() {
      var deleteUser = {
        method: 'DELETE',
        uri: url+'api/users/2'
      };
      return reqAsync(deleteUser).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        return reqAsync(getOrgDashboard);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // Success
        var orgInfo = JSON.parse(body);
        expect(orgInfo.members.length).to.equal(1);
      });
    });
  });
  describe('throws an error if permissions are insufficient', function() {
    beforeEach(function() {
      return reqAsync(clientLogin);
    });
    it('errors getting dashboard', function() {
      return reqAsync(getOrgDashboard).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User Error
      });
    });
    it('fails to retrieve sensitive fields', function() {
      return reqAsync(getOrgClient).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/); // User Error
        var orgInfo = JSON.parse(body);
        expect(orgInfo.members[0].last_name).to.equal('Bryan');
        expect(orgInfo.members[0].password_hash).to.equal(undefined);
        expect(orgInfo.members[0].email).to.equal(undefined);
      });
    });
  });
  describe('throws an error if user is logged out', function() {
    beforeEach(function() {
      return reqAsync(logOut);
    });
    it('errors getting client', function() {
      return reqAsync(getOrgClient).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error
      });
    });
  });
  describe('throws an error if user is signed into another account', function() {
    beforeEach(function() {
      var signUp = {
        method: 'POST',
        uri: url+'api/signup',
        json: {
          first_name: 'notbryan',
          last_name: 'notbryan',
          email: 'not@bry.an',
          password: 'bryan'
        }
      };
      return reqAsync(signUp);
    });
    it('errors updating from another account', function() {
      var updateUser = {
        method: 'PUT',
        uri: url+'api/users/1',
        json: {
          title: 'Not-At-All Evil'
        }
      };
      return reqAsync(updateUser).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error
      });
    });
    it('errors if deleting from another account', function() {
      var deleteUser = {
        method: 'DELETE',
        uri: url+'api/users/1'
      };
      return reqAsync(deleteUser).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error
      });
    });
  });
  describe('throws an error if requestion illegal operations as admin', function() {
    beforeEach(function() {
      var signUp = {
        method: 'POST',
        uri: url+'api/signup',
        json: {
          first_name: 'notbryan',
          last_name: 'notbryan',
          email: 'not@bry.an',
          password: 'bryan'
        }
      };
      var addOrg = {
        method: 'POST',
        uri: url+'api/orgs/',
        json: {
          name: 'Cult of Bryan',
          logo: 'rosary.png',
          welcome_message: 'All hail Bryan'
        }
      };
      return reqAsync(signUp)
      .then(function() { return reqAsync(addOrg); });
    });
    it('throws an error if updating an unaffiliated user as an org\'s default', function() {
      var updateOrg = {
        method: 'PUT',
        uri: url+'api/orgs/',
        json: {
          default_id: '1'
        }
      };
      return reqAsync(updateOrg).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // Success
      });
    });
    it('throws an error if deleting self as admin', function() {
      var deleteUser = {
        method: 'DELETE',
        uri: url+'api/users/3'
      };
      return reqAsync(deleteUser).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^4\d\d$/); // User error
      });
    });
    it('deletes an organization', function() {
      var deleteOrg = {
        method: 'DELETE',
        uri: url+'api/orgs/'
      };
      return reqAsync(deleteOrg).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/);
        return reqAsync(getOrgDashboard);
      }).spread(function(res, body) {
        expect(res.statusCode.toString()).to.match(/^2\d\d$/);
        expect(body).to.equal('{}');
      });
    });
  });
});
