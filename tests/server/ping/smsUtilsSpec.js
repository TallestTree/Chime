var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');

describe('smsUtils', function() {
  var smsUtils = rewire('../../../server/ping/smsUtils');
  var Promise = require('bluebird');
  smsUtils.__set__('request', function() {
    return Promise.try(function() {
        return { success: true };
      });
  });

  it('sends a text', function(done) {
    smsUtils({to:'5551234567'}, function(error) {
      expect(error).to.equal(null);
      done();
    });
  });
  it('throws an error if there is no destination address', function(done) {
    smsUtils({}, function(error) {
      expect(error).to.not.equal(null);
      done();
    });
  });
});
