var voicejs = require('voice.js');
try {
  var config = require('../config/config');
} catch(e) {}
var _ = require('underscore');

// Create reusable client object
var client = new voicejs.Client({
  email: process.env.GMAIL_EMAIL || config.gmail.email,
  password: process.env.GMAIL_PASSWORD || config.gmail.password
});

module.exports = function(smsOptions, cb) {
  // Use voice.js for Google Voice
  smsOptions = smsOptions || {};
  _.defaults(smsOptions, {
    text: 'You have an anonymous visitor. - Tallest Tree App',
  });

  cb = cb || function(err, response, data) {
    if(err || !response.body.ok) {
      console.error(err || 'Error sending text: ' + response.body.data.code);
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
