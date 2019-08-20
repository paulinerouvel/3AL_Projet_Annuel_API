

const nodemailer = require('nodemailer');
const manage_logs = require("../utils/manage_logs");
class MailController {

    async sendMail(sender, destination, subject, message) {
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
            html: '<b>' + message + '</b>'
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
        return true;

    }

}

module.exports = new MailController();