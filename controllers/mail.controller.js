

const nodemailer = require('nodemailer');
class MailController {

    async sendMail(sender, destination, subject, message) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'josette.marianne12@gmail.com',
                pass: 'mariannejames12'
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
                return false;
                
    
            }
            console.log('Message sent: ' + info.response);
        });
    
        transporter.close();
        return true;

    }

}

module.exports = new MailController();