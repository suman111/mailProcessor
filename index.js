const express = require('express');
var sendMail = require('./sendMail');
var readMail = require('./readMail');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Welcome');       
})

app.get('/send', (req, res) => {
    res.send('mail was send successfully');
    sendMail.mailSender();       
})

app.get('/read', (req, res) => {
    res.send('reading inbox and updated DB');
    readMail.mailRead()      
})

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))