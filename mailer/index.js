
var config = require('../config/mailer.js');
var nodemailer = require('nodemailer');
var path = require('path');
var templatesDir = path.resolve(__dirname, 'templates');
var emailTemplates = require('email-templates');

var emailAddressReqErr = new Error('email address required');


// defaultTransport using nodemailer, gmail, and auth from config file.
var defaultTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: config.mailer.auth.user,
    pass: config.mailer.auth.pass
  }
});


// export methods
exports.sendOne = function(templateName, locals, fn) {
  console.log('SEND ONE');
  console.log(templateName);
  console.log(locals);
  console.log(typeof fn);
  // validate user email requirement
  if(!locals.email) {
    return fn(emailAddressReqErr);
  }

  // validate message requirement
  if(!locals.subject) {
    return fn(emailAddressReqErr);
  }

  // FIXME: comment out console.logs later in mailer
  // GET email template and send mail
  emailTemplates(templatesDir, function(err, template) {
    if(err) {
      // console.log(err);

      return fn(err);
    }

    // send a single email
    template(templateName, locals, function(err, html, text) {
      if(err) {
        // console.log(err);
        return fn(err);
      }

      // check for process environment.
      // returns success message during testing.
      if(process.env.NODE_ENV === 'test') {
        return fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text);
      }

      var transport = defaultTransport;
      transport.sendMail({
        from: config.mailer.defaultFromAddress,
        to: locals.email,
        subject: locals.subject,
        html: html,
        // generateTextfromHTML: true
        text: text
      }, function(err, responseStatus) {
        if(err) {
          return fn(err);
        }

        return fn(null, responseStatus.message, html, text);
      });
    });
  });
};
