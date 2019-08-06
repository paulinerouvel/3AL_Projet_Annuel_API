'use strict';

const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const MailController = require('../controllers').mailController;



const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const sender = req.body.sender;
    const destination = req.body.destination;
    const subject = req.body.subject;
    const message = req.body.message;

    if (sender != undefined && destination != undefined && subject != undefined && message != undefined) {
        let result = await MailController.sendMail(sender, destination, subject, message);

        if (result) {
            return res.status(200).end();
        }
        else {
            return res.status(500).end();
        }

    }
    return res.status(400).end();


});



module.exports = router;