var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
var rewire = require('rewire');

describe('emailUtils', function() {
  var emailUtils = rewire('../../../../server/utils/pingUtils/emailUtils');
  emailUtils.__set__('transporter', {
    sendMail: function(mailOptions, cb) {
      cb(null, {
        response: 250
      });
    }
  });

  it('sends an email', function(done) {
    emailUtils({to:'anon@somesite.com'}, function(error, info) {
      expect(error).to.equal(null);
      expect(info.response).to.equal(250);
      done();
    });
  });
  it('throws an error if there is no destination address', function(done) {
    emailUtils({}, function(error, info) {
      expect(error).to.not.equal(null);
      done();
    });
  });
});
