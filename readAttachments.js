var imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');
var fs = require('fs');

var mailAttachments = exports.mailAttachments = () => {
  // imap configuration
  var config = {
    imap: {
      tlsOptions: { rejectUnauthorized: false },
      user: 'your mail id',
      password: 'your password',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 3000
    }
  };
  // connecting imap
  imaps.connect(config).then(function (connection) {

    connection.openBox('INBOX').then(function () {
        // Fetch emails from now      
        var yesterday = new Date();
        yesterday.setTime(Date.now());
        yesterday = yesterday.toISOString();
        var searchCriteria = ['UNSEEN', ['SINCE', yesterday]];
        var fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'], struct: true };

        // retrieve only the headers of the messages
        return connection.search(searchCriteria, fetchOptions);
    }).then(function (messages) {

        var attachments = [];
        messages.forEach(function (message) {
            var parts = imaps.getParts(message.attributes.struct);
            attachments = attachments.concat(parts.filter(function (part) {
                return part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT';
            }).map(function (part) {
                // retrieve the attachments only of the messages with attachments
                return connection.getPartData(message, part)
                    .then(function (partData) {
                        let str = Buffer.from(partData).toString();
                        // upload the attachments in to local
                        fs.writeFile(part.disposition.params.filename, partData, function (err) {
                            if (err) return console.log(err);
                            console.log('successfully writed the attachments');
                        });
                        return {
                            filename: part.disposition.params.filename,
                            data: partData
                        };
                    });
            }));
        });
        return Promise.all(attachments);
    }).then(function (attachments) {
        console.log(attachments);
    });
});
}

