var imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');
var MongoClient = require('mongodb');
var assert = require('assert');

var url = "mongodb://localhost:27017/newTest";

var mailRead = exports.mailRead = () => {

  // imap configuration
  var config = {
    imap: {
      tlsOptions: { rejectUnauthorized: false },
      user: 'your email id',
      password: 'password',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 3000
    }
  };
  // connecting imap
  imaps.connect(config).then(function (connection) {
    return connection.openBox('INBOX').then(function () {
      var searchCriteria = [
        'UNSEEN'
      ];
      var fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
      };
      return connection.search(searchCriteria, fetchOptions).then(function (messages) {
        messages.forEach(function (item) {
          var all = _.find(item.parts, { "which": "" })
          var id = item.attributes.uid;
          var idHeader = "Imap-Id: " + id + "\r\n";
          simpleParser(idHeader + all.body, (err, mail) => {
            // access to the whole mail object
            console.log(mail.subject)
            console.log(mail.text)

            // make client connect to mongo service
            MongoClient.connect(url, function (err, db) {
              assert.equal(null, err);
              // db pointing to newdb
              console.log("Switched to " + db.databaseName + " database");

              // document to be inserted
              var doc = { subject: mail.subject, content: mail.text };

              // insert document to 'mail' collection using insert
              db.collection("mail1").insert(doc, function (err, res) {
                assert.equal(null, err);
                console.log("Document inserted");
                db.close();
              });
            });


          });
        });
      });
    });
  });

  console.log('doc..', doc);

}

