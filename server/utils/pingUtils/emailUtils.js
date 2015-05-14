var nodemailer = require('nodemailer');
var _ = require('underscore');

// Create reusable transporter object using SMTP transport
if (!process.env.TEST) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USERNAME || require('../../config/config').gmail.username,
      pass: process.env.GMAIL_PASSWORD || require('../../config/config').gmail.password
    }
  });
}

module.exports = function(mailOptions, cb) {
  mailOptions = mailOptions || {};
  _.defaults(mailOptions, {
    from: 'Chime <'+process.env.GMAIL_EMAIL||config.gmail.email+'>',
    subject: '☎ Visit from Anon',
    text: 'You have an anonymous visitor.',
  });

  cb = cb || function(error, info) {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  };

  if (!mailOptions.to) {
    cb('Error: No destination address for mail');
  } else {
    transporter.sendMail(mailOptions, cb);
  }
};
