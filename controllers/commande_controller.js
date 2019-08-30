const Database = require('../models/database');
const Commande = require('../models/commande_model');
const Produit = require('../models/produit_model');
const manage_logs = require("../utils/manage_logs");
const MailController = require('./mail.controller');
const PayementController = require('./payement_controller');
const UserController = require('./utilisateur_controller');

const pdfkit = require('pdfkit');
const fs = require('fs');
const request = require('request');
const path = require('path');


class CommandeController {


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/


    async addOrder(date, utilisateurID, adresse_livraison, cp_livraison, ville_livraison) {

        try {
            const res = await Database.connection.execute('INSERT INTO `commande` (`date`, `adresse_livraison`, `cp_livraison`, `ville_livraison` , `Utilisateur_id`) VALUES (?, ?, ?, ?, ?)', [date, adresse_livraison, cp_livraison, ville_livraison, utilisateurID]);
            return res;
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "addOrder");
            return 500;
        }


    }



    async addProductInOrder(commande_has_produit) {
        try {
            const res = await Database.connection.execute('INSERT INTO commande_has_produit (Produit_id,  Commande_id, quantite) VALUES (?, ?, ?)',
                [commande_has_produit.produit_id, commande_has_produit.commande_id, commande_has_produit.quantite]);

            return res;
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "addProductInOrder");
            return 500;

        }


    }




    async sendMailAndFacture(idCommande) {

        let dir = 'factures';

        fs.readdir(dir, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(dir, file), err => {
                    if (err) throw err;
                });
            }
        });

        //Send facture
        let cmd = await this.getOrderByID(idCommande);


        let now = new Date(Date.now());
        let dateT = now.toISOString().split('T');
        let date = dateT[0].split('-');



        let user = await UserController.getUserByID(cmd.utilisateur_id);


        let produits = await this.getAllProductsInOrder(idCommande);

        let payement = await PayementController.getPayementByIdCmd(idCommande);


        let total = 0;

        for (const p of produits) {
            total += p.prix;
        }


        let month = date[1];
        let day = date[2];

        if (month.length == 1) {
            month = "0" + month;
        }

        if (day.length == 1) {
            day = "0" + day;
        }


        if (user.libelle == "") {


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
            doc.fontSize(12).text(user.nom + " " + user.prenom, 380, 90);
            doc.moveDown();
            doc.fontSize(12).text(payement[0].adresse_facturation, 380, 110);
            doc.moveDown();
            doc.fontSize(12).text(payement[0].cp_facturation + " " + payement[0].ville_facturation, 380, 130);
            doc.moveDown();
            doc.fontSize(12).text(user.mail, 380, 150);
            doc.moveDown();
            doc.fontSize(12).text(user.tel, 380, 170);
            doc.moveDown();





            doc.fontSize(25).text('Facture du ' + day + "/" + month + "/" + date[0] + ' n°' + idCommande, 100, 280, {
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


            for (const produit of produits) {
                doc.fontSize(15).text('-' + produit.libelle + " x " + produit.quantite);
                doc.fontSize(15).text(produit.prix + ' €', { align: "right" });
                doc.moveDown();
            }



            doc.fontSize(15).text('TOTAL');
            doc.fontSize(15).text(total + ' €', { align: "right" });
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();



            doc.fontSize(15).text('Adresse de livraison', { underline: "true" });
            doc.moveDown();
            doc.fontSize(15).text(user.adresse);
            doc.moveDown();
            doc.fontSize(15).text(user.codePostal + " " + user.ville);
            doc.moveDown();


            var wstream = fs.createWriteStream('factures/facture_cmd_' + idCommande + '.pdf');




            doc.pipe(wstream);


            doc.end();
            wstream.on('finish', function () {

                var req = request.post("http://51.75.143.205:8080/factures", function (err, resp, body) {
                    if (err) {
                        console.log('Error!', err);
                    } else {
                        console.log('URL: ' + body);
                    }
                });

                var form = req.form();

                let fsRead = fs.createReadStream('factures/facture_cmd_' + idCommande + '.pdf')

                form.append('file', fsRead);




                req;


                //send mail



                let message = "<!DOCTYPE html>" +
                    "<html>" +
                    "<t/><h3>Bonjour " + user.prenom + " " + user.nom + ", </h3><br/>" +
                    "<h4>Vous avez commandé des produits sur <a href='#'>WasteMart</a>. <br/>" +
                    "Vous trouverez ci-joint la facture de votre achat contenant les modalités de livraison de votre commande." +

                    "<br/><br/>" +
                    "Nous vous remercions de votre achat, et espérons vous revoir rapidement !" +
                    "<br/><br/>" +
                    "L'équipe WasteMart. " +
                    "</h4>" +


                    "</html>";

                MailController.sendMail("wastemart.company@gmail.com", user.mail, "Votre commande du " + day + "/" + month + "/" + date[0], message, 'factures/facture_cmd_' + idCommande + '.pdf');




            });


        }
        else {

            let month = date[1];
            let day = date[2];

            if (month.length == 1) {
                month = "0" + month;
            }

            if (day.length == 1) {
                day = "0" + day;
            }

            let message = "<!DOCTYPE html>" +
                "<html>" +
                "<t/><h3>Bonjour, </h3><br/>" +
                "<h4>Vous avez commandé des produits sur <a href='#'>WasteMart</a>. <br/>" +
                "Vous trouverez ci-joint la facture de votre achat contenant les modalités de livraison de votre commande." +

                "<br/><br/>" +
                "Nous vous remercions de votre commande, et espérons vous revoir rapidement !" +
                "<br/><br/>" +
                "L'équipe WasteMart. " +
                "</h4>" +


                "</html>";

            MailController.sendMail("wastemart.company@gmail.com", user.mail, "Votre commande du " + day + "/" + month + "/" + date[0], message, null);
        }

        
    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/


    async getOrderByID(id) {

        try {
            const results = await Database.connection.query('SELECT * FROM commande WHERE commande.id = ?', [id]);
            const rows = results[0];
            if (rows.length > 0) {

                return new Commande(rows[0].id, rows[0].date, rows[0].Utilisateur_id, rows[0].adresse_livraison, rows[0].cp_livraison, rows[0].ville_livraison);
            }
            return [];
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getOrderByID");
            return 500;
        }

    }

    async getOrderByIdUser(id) {


        try {
            const results = await Database.connection.query('SELECT * FROM commande WHERE commande.Utilisateur_id = ?', [id]);

            return results[0].map((rows) => new Commande(rows.id, rows.date, rows.Utilisateur_id, rows.adresse_livraison, rows.cp_livraison, rows.ville_livraison));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getOrderByIdUser");
            return 500;
        }

    }


    async getLastOrderByIdUser(id) {
        try {
            const results = await Database.connection.query('select * FROM commande c WHERE c.date = (select max(date) FROM commande WHERE Utilisateur_id = ?)', [id]);

            return results[0].map((rows) => new Commande(rows.id, rows.date, rows.Utilisateur_id, rows.adresse_livraison, rows.cp_livraison, rows.ville_livraison));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getLastOrderByIdUser");
            return 500;
        }

    }





    async getAllOrders() {
        try {
            const res = await Database.connection.query('SELECT * FROM `commande`');
            if (res.length > 0) {

                return res[0].map((rows) => new Commande(rows.id, rows.date, rows.Utilisateur_id, rows.adresse_livraison, rows.cp_livraison, rows.ville_livraison));
            }
            else {
                return [];
            }

        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getAllOrders");
            return 500;
        }

    }

    async getAllProductsInOrder(order_id) {
        try {
            const res = await Database.connection.query('SELECT produit.id, produit.libelle, produit.desc, produit.photo, produit.prix, produit.prixInitial,  produit.DLC, produit.codeBarre, produit.enRayon, produit.dateMiseEnRayon, produit.CategorieProduit_id, produit.Liste_Produit_id, produit.Entrepot_id, produit.destinataire,  commande_has_produit.quantite FROM `produit`, `commande_has_produit` WHERE Commande_id = ? AND Produit_id = produit.id', [order_id]);

            return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));


        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getAllProductsInOrder");
            return 500;
        }

    }



    async getSumOfProductsOrderByUserAndDate(dateDebut, dateFin, idUser) {
        try {

            //SELECT * FROM `commande` WHERE DATEDIFF(date,'2019-07-01') >=0 => superieur à 2019...
            let res = await Database.connection.query('SELECT  SUM(chp.quantite) as total FROM `commande_has_produit` as chp, `commande` WHERE commande.id = chp.Commande_id AND commande.Utilisateur_id = ? AND DATEDIFF(date, ? ) >= 0 AND DATEDIFF(date, ? ) <= 0 ',
                [idUser, dateDebut, dateFin]);


            if (res[0].total == null) {
                return 0;
            }

            return res[0];

        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getSumOfProductsOrderByUserAndDate");
            return 500;
        }

    }


    /***********************************************************************************/
    /**                                DELETE FUNCTIONS                               **/
    /***********************************************************************************/
    async deleteOrder(id) {
        try {

            try {

                await Database.connection.execute('DELETE FROM payement WHERE id_commande = ?', [id]);

            }
            catch (err) {
                console.log(err);
                manage_logs.generateLogs(err, "commande_controller.js", "deleteOrder");
                return 500;
            }

            const res = await Database.connection.execute('DELETE FROM commande WHERE commande.id = ?', [id]);
            await this.deleteProductInOrder(id);
            return res;
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "deleteOrder");
            return 500;
        }
    }

    async deleteProductInOrder(id) {
        try {

            const res = await Database.connection.execute('DELETE FROM commande_has_produit WHERE Commande_id = ?', [id]);
            return res;
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "deleteProductInOrder");
            return 500;
        }
    }
}

module.exports = new CommandeController();