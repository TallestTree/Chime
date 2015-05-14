var voicejs = require('voice.js');
var _ = require('underscore');

// Create reusable client object
if (!process.env.TEST) {
  var client = new voicejs.Client({
    email: process.env.GMAIL_EMAIL || require('../../config/config').gmail.email,
    password: process.env.GMAIL_PASSWORD || require('../../config/config').gmail.password
  });
}

module.exports = function(smsOptions, cb) {
  // Use voice.js for Google Voice
  smsOptions = smsOptions || {};
  _.defaults(smsOptions, {
    text: 'You have an anonymous visitor. - Chime',
  });

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
