var voicejs = require('voice.js');
var _ = require('underscore');

// Creates reusable client object
if (process.env.NODE_ENV !== 'test') {
  var client = new voicejs.Client({
    email: process.env.GMAIL_EMAIL || require('../config/config').gmail.email,
    password: process.env.GMAIL_PASSWORD || require('../config/config').gmail.password
  });
}

module.exports = function(smsOptions, cb) {
  // Uses voice.js for Google Voice
  smsOptions = smsOptions || {};

  cb = cb || function(error, response, data) {
    if (error || !response.body.ok) {
      console.error(error || 'Error sending text: ' + response.body.data.code);
    } else {
      console.log('Text sent: ', response);
    }
  };

  if (!smsOptions.to) {
    cb('Error: No destination address for text');
  } else {
    client.altsms(smsOptions, cb);
  }
};
