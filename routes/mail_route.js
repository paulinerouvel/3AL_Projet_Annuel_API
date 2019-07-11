'use strict';

const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const ListController = require('../controllers').listController;
const nodemailer = require('nodemailer');



const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'josette.marianne12@gmail.com',
            pass: 'mariannejames12'
        }
    });
    var mailOptions = {
        from: req.body.sender,
        to: req.body.destination,
        subject: req.body.subject,
        text: req.body.message,
        html: '<b>' + req.body.message + '</b>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
            
        }
        console.log('Message sent: ' + info.response);
    });

    transporter.close();

    res.status(200).end();
});



module.exports = router;