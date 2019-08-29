

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

        var mailOptions;

        if(file != null){
            mailOptions = {
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
        }

        else{

            mailOptions = {
                from: sender,
                to: destination,
                subject: subject,
                text: message,
                html: '<b>' + message + '</b>'
            };

        }




        try{
            await transporter.sendMail(mailOptions); 
            transporter.close();

            console.log('Message sent');
            return 200;
        }
        catch(err){
           console.log(err);
           manage_logs.generateLogs(err, "mail_controller.js", "sendMail");
           return 500;
        }

    
    }

}

module.exports = new MailController();