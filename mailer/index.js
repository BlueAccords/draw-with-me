
var config = require('../config/mailer.js');
var nodemailer = require('nodemailer');
var path = require('path');
var templatesDir = path.resolve(__dirname, 'templates');
var EmailTemplate = require('email-templates').EmailTemplate;

var EmailAddressRequiredError = new Error('email address required');


// create a defaultTransport using gmail and authentication that are
// stored in the `config.js` file.
var defaultTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.mailer.auth.user,
    pass: config.mailer.auth.pass
  }
});


exports.sendOne = function(templateName, locals, fn) {
  // make sure that we have an user email
  if (!locals.email) {
    return fn(EmailAddressRequiredError);
  }
  // make sure that we have a message
  if (!locals.subject) {
    return fn(EmailAddressRequiredError);
  }

  var template = new EmailTemplate(path.join(templatesDir, templateName));

  var sendMailer = defaultTransport.templateSender(template, {
    from: config.mailer.defaultFromAddress,
    // to: locals.email,
    // subject: locals.subject,
    // html: results.html,
    // // generateTextFromHTML: true,
    // text: results.text
  });
  
  sendMailer({
    to: locals.email,
    subject: locals.subject,
    // apparently templateSender auto renders the html/text
  }, {
    username: 'mesaslinger@gmail.com',
    password: process.env.PW,
  }, function(err, info) {
    if(err) return fn(err);

    return fn(null, info);
  });


  // template.render(locals, function(err, results)
  //   console.log(err);
  //   if(err) {
  //     return fn(err);
  //   }


    // transport.sendMail({
    //   from: config.mailer.defaultFromAddress,
    //   to: locals.email,
    //   subject: locals.subject,
    //   html: results.html,
    //   // generateTextFromHTML: true,
    //   text: results.text
    // }, function (err, responseStatus) {
    //   if (err) {
    //     return fn(err);
    //   }
    //   return fn(null, responseStatus.message, html, text);
    // });
  // });
};
