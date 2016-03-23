// config settings for mailer

module.exports = {
  mailer: {
    auth: {
      user: 'mesaslinger',
      pass: process.env.PW,
    },
    defaultFromAddress: 'Blue Accords <draw-with-me@example.com',
  }
};
