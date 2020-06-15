const express = require('express');
var sendMail = require('./sendMail');
var readMail = require('./readMail');
var readAttachments = require('./readAttachments');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to mail processor');       
})

app.get('/send', (req, res) => {
    res.send('mail was send successfully');
    sendMail.mailSender();       
})

app.get('/read', (req, res) => {
    res.send('reading inbox and updated DB');
    readMail.mailRead()      
})

app.get('/attachments', (req, res) => {
    res.send('Successfully read attachments in inbox and uploaded in to local');
    readAttachments.mailAttachments();
})

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))