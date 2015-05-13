// Remember old information to revert afterwards
var oldInfo = {
  PORT: process.env.PORT,
  TEST: process.env.TEST
};

// Change some environmental variables before starting tests
process.env.PORT = 55987;
process.env.TEST = true;

var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var http = require('http');
var app = require('../../../server/app');
var instance;

describe('apiRoutes', function() {
  before(function(done) {
    instance = http.createServer(app).listen(process.env.PORT);
    instance.on('listening', function() {
      console.log('Listening');
      done();
    });
  });
  after(function(done) {
    instance.close();
    console.log('Stopped');
    // process.env properties are coerced into strings so delete these to stop string 'undefined'
    if (oldInfo.PORT) {
      process.env.PORT = oldInfo.PORT;
    } else {
      delete process.env.PORT;
    }
    if (oldInfo.TEST) {
      process.env.TEST = oldInfo.TEST;
    } else {
      delete process.env.TEST;
    }
    done();
  });
  it('should fetch the dashboard', function(done) {
    http.get('http://localhost:'+process.env.PORT+'/api/orgs/dashboard?id=1', function(res) {
      res.on('data', function(body) {
        console.log(body.toString());
        // expect(!!body.id).to.equal(true);
        done();
      });
    });
  });
});
