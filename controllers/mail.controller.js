

const nodemailer = require('nodemailer');
const manage_logs = require("../utils/manage_logs");
const fs = require('fs');
class MailController {

    async sendMail(sender, destination, subject, message, file) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'wastemart.company@gmail.com',
                pass: 'WasteMartCompany2019'
            }
        });
        var mailOptions = {
            from: sender,
            to: destination,
            subject: subject,
            text: message,
            html: '<b>' + message + '</b>',
            attachments: [{
                filename: file,
                path: file,
                contentType: 'application/pdf'
              }],
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                manage_logs.generateLogs(error, "mail_controller.js", "sendMail");
                return false;
                
    
            }
            console.log('Message sent: ' + info.response);
        });
    
        transporter.close();


    }

}

module.exports = new MailController();