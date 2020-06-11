const nodemailer = require('nodemailer');

var mailSender= exports.mailSender = ()=> {

    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your email id',
          pass: 'your password'
        }
      });
      
      const message = {
        from: 'your email id', // Sender address
        to: 'any email id',         // List of recipients
        subject: 'test mail', // Subject line
        text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
      };
      // sending message
      transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
      });

}
