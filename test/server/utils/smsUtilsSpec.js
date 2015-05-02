var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('smsUtils', function() {
  var rewire = require('rewire');
  var smsUtils = rewire('../../../server/utils/smsUtils');

  before(function() {
    smsUtils.__set__('client', {
      altsms: function(smsOptions, cb) {
        cb(null, {
          body: {ok: true}
        });
      }
    });
  });

  describe('smsUtils', function() {
    it('sends a text', function(done) {
      smsUtils({to:'5551234567'}, function(err, response, data) {
        expect(err).to.equal(null);
        expect(response.body.ok).to.equal(true);
        done();
      });
    });
    it('throws an error if there is no destination address', function(done) {
      smsUtils({}, function(err, response, data) {
        expect(err.substring(0,5)).to.equal('Error');
        done();
      });
    });
  });
});
