const Database = require('../models/database');
const Don = require('../models/don_model');
const manage_logs = require("../utils/manage_logs");

const MailController = require('./mail.controller');
const PayementController = require('./payement_controller');
const UserController = require('./utilisateur_controller');

const pdfkit = require('pdfkit');
const fs = require('fs');
const request = require('request');
const path = require('path');


class DonController {


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/

    async addDon(don) {

        try {

            return await Database.connection.execute('INSERT INTO `don` (date, montant, Donneur_id, Receveur_id ) VALUES (?, ?, ?, ?);', [don.date, don.montant, don.Donneur_id, don.Receveur_id]);

        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "don_controller.js", "addDon");
            return 500;
        }
    }



    async sendMailAndFacture(idDon) {

        let dir = 'factures';

        fs.readdir(dir, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(dir, file), err => {
                    if (err) throw err;
                });
            }
        });

        //sendFacture
        let don = await this.getDonByID(idDon);

        don = don[0];



        let now = new Date(Date.now());
        let dateT = now.toLocaleString('fr-FR').split(' ');
        let date = dateT[0].split('-');


        let payement = await PayementController.getPayementByIdDon(idDon);

        let donneur = await UserController.getUserByID(don.Donneur_id);
        let receveur = await UserController.getUserByID(don.Receveur_id);






        let month = date[1];
        let day = date[2];

        if (month.length == 1) {
            month = "0" + month;
        }

        if (day.length == 1) {
            day = "0" + day;
        }




        //create facture

        let doc = new pdfkit();
        doc.fontSize(15).text('The WasteMart Company');
        doc.moveDown();
        doc.fontSize(15).text('33 rue de la haie dieu');
        doc.moveDown();
        doc.fontSize(15).text('Paris 75012');
        doc.moveDown();
        doc.fontSize(12).text('wastemart.company@gmail.com');
        doc.moveDown();

        doc.fontSize(15).text('Adresse de facturation', 380, 70, { underline: "true" });
        doc.moveDown();
        doc.fontSize(12).text(donneur.nom + " " + donneur.prenom, 380, 90);
        doc.moveDown();
        doc.fontSize(12).text(payement[0].adresse_facturation, 380, 110);
        doc.moveDown();
        doc.fontSize(12).text(payement[0].cp_facturation + " " + payement[0].ville_facturation, 380, 130);
        doc.moveDown();
        doc.fontSize(12).text(donneur.mail, 380, 150);
        doc.moveDown();
        doc.fontSize(12).text(donneur.tel, 380, 170);
        doc.moveDown();





        doc.fontSize(25).text('Facture du ' + day + "/" + month + "/" + date[0] + ' n°' + idDon, 100, 280, {
            align: "center",
            underline: "true"
        });

        doc.lineWidth(1);
        doc.lineCap('butt')
            .moveTo(0, 350)
            .lineTo(611, 350)
            .stroke();

        doc.moveDown();
        doc.moveDown();


        doc.fontSize(15).text('Donneur', {underline: 'true'});
        doc.fontSize(15).text('Receveur', {underline: 'true', align: "right" });

        doc.fontSize(15).text(donneur.nom + " " + donneur.prenom);
        doc.fontSize(15).text(receveur.libelle, { align: "right"});
        doc.moveDown();




        doc.fontSize(15).text('TOTAL DU DON');
        doc.fontSize(15).text(don.montant + ' €', { align: "right" });
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();




        var wstream = fs.createWriteStream('factures/facture_don_' + idDon + '.pdf');




        doc.pipe(wstream);


        doc.end();
        wstream.on('finish', async function () {

            var req = request.post("http://51.75.143.205:8080/factures", function (err, resp, body) {
                if (err) {
                    console.log('Error!', err);
                } else {
                    console.log('URL: ' + body);
                }
            });

            var form = req.form();

            let fsRead = fs.createReadStream('factures/facture_don_' + idDon + '.pdf')

            form.append('file', fsRead);




            req;


            //send mail



        

            let messageDonneur = "<!DOCTYPE html>"+
            "<html>"+
                "<t/><h3>Bonjour "+ donneur.prenom +" "+ donneur.nom +", </h3><br/>"+
                "<h4>Vous avez effectué un don sur <a href='#'>WasteMart</a> à l'association <b>"+ receveur.libelle +"</b>. <br/>"+
                "Vous trouverez ci-joint la facture de votre don."+
                
                "<br/><br/>"+
                "Nous vous remercions de votre don, et espérons vous revoir rapidement !"+
                "<br/><br/>"+
                "L'équipe WasteMart. "+
                "</h4>"+
                
                
            "</html>";

            let messageReceveur = "<!DOCTYPE html>"+
            "<html>"+
                "<t/><h3>Bonjour, </h3><br/>"+
                "<h4>Vous avez reçu un don d'un utilisateur sur <a href='#'>WasteMart</a>! <br/>"+
                "Rendez-vous sur WasteMart pour consultez le montant du don et remercier le généreux donnateur."+
                
                "<br/><br/>"+
                "Nous espérons vous revoir rapidement !"+
                "<br/><br/>"+
                "L'équipe WasteMart. "+
                "</h4>"+
                
                
            "</html>";



            await MailController.sendMail("wastemart.company@gmail.com", donneur.mail, "Votre don du " + day + "/" + month + "/" + date[0], messageDonneur, 'factures/facture_don_' + idDon + '.pdf');
            await MailController.sendMail("wastemart.company@gmail.com", receveur.mail, "Nouveau don reçu !", messageReceveur, null);



        });
 



    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/
    async getAllDonByDonneurID(id) {

        try {
            const results = await Database.connection.query('SELECT * FROM don WHERE don.Donneur_id = ?', [id]);

            return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.Donneur_id, rows.Receveur_id));

        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "don_controller.js", "getAllDonByDonneurID");
            return 500;
        }
    }

    async getDonByID(id) {

        try {
            const results = await Database.connection.query('SELECT * FROM don WHERE don.id = ?', [id]);

            return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.Donneur_id, rows.Receveur_id));

        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "don_controller.js", "getDonByID");
            return 500;
        }
    }

    async getAllDonByReceveurID(id) {

        try {
            const results = await Database.connection.query('SELECT * FROM don WHERE don.Receveur_id = ?', [id]);
            return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.Donneur_id, rows.Receveur_id));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "don_controller.js", "getAllDonByReceveurID");
            return 500;
        }
    }

    async getDonOfTheDay(date) {

        try {
            const results = await Database.connection.query('SELECT * FROM don WHERE date = ?', [date]);
            return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.Donneur_id, rows.Receveur_id));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "don_controller.js", "getDonOfTheDay");
            return 500;
        }
    }


    async getAllDons() {
        try {
            const res = await Database.connection.query('SELECT * FROM `don`');
            return res[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.Donneur_id, rows.Receveur_id));

        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "don_controller.js", "getAllDons");
            return 500;
        }

    }

    async getLastDonByIdUser(idDonneur) {
        try {
            const results = await Database.connection.query('select * FROM don d WHERE d.date = (select max(date) FROM don WHERE Donneur_id = ?)', [idDonneur]);

            return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.Donneur_id, rows.Receveur_id));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "don_controller.js", "getLastDonByIdUser");
            return 500;
        }
    }





    /***********************************************************************************/
    /**                              DELETE FUNCTIONS                                 **/
    /***********************************************************************************/

    async deleteDon(id) {
        try {

            const res = await Database.connection.execute('DELETE FROM don WHERE don.id', [id]);
            return res;
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "don_controller.js", "deleteDon");
            return 500;
        }
    }
}

module.exports = new DonController();