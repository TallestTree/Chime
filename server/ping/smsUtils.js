var _ = require('underscore');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

module.exports = function(smsOptions, cb) {
  // Uses textbelt
  smsOptions = smsOptions || {};

  if (!smsOptions.to) {
    cb('Error: No destination address for text');
  } else {
    request({
      method: 'POST',
      uri: 'http://textbelt.com/text',
      json: {
        number: smsOptions.to,
        message: smsOptions.text
      }
    }).then(function(result) {
      if (result.success) {
        cb(null);
      } else {
        cb(result.message);
      }
    }).catch(function(error) {
      cb(error);
    });
  }
};
