var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');

describe('smsUtils', function() {
  var smsUtils = rewire('../../../server/ping/smsUtils');
  smsUtils.__set__('client', {
    altsms: function(smsOptions, cb) {
      cb(null, {
        body: {ok: true}
      });
    }
  });

  it('sends a text', function(done) {
    smsUtils({to:'5551234567'}, function(error, response, data) {
      expect(error).to.equal(null);
      expect(response.body.ok).to.equal(true);
      done();
    });
  });
  it('throws an error if there is no destination address', function(done) {
    smsUtils({}, function(error, response, data) {
      expect(error).to.not.equal(null);
      done();
    });
  });
});
