var nodemailer = require('nodemailer');
var config = require('../config/config');
var _ = require('underscore');

// Create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.gmail.username,
    pass: config.gmail.password
  }
});

// NB! No need to recreate the transporter object. You can use the same transporter object for all e-mails
module.exports = function(mailOptions, cb) {
  mailOptions = mailOptions || {};
  _.defaults(mailOptions, {
    from: 'Tallest Tree App <TallestTreeApp@gmail.com>',
    subject: '☎ Visit from Anon',
    text: 'You have an anonymous visitor.',
  });

  cb = cb || function(err, info) {
    if(err) {
      console.error(err);
    } else {
      console.log('Message sent: ' + info.response);
    }
  };

  if (!mailOptions.to) {
    cb('Error: No destination address for mail');
  } else {
    // Send mail with defined transport object
    transporter.sendMail(mailOptions, cb);
  }
};
