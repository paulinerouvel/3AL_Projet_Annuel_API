'use strict';

const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const Don = require('../models/don_model');
const DonController = require('../controllers').donController;
const UserController = require('../controllers').utilisateurController;
const MailController = require('../controllers').mailController;


const router = express.Router();
router.use(bodyParser.json());


/***********************************************************************************/
/**                                   POST REQUESTS                               **/
/***********************************************************************************/


//Création d'un don
router.post('/', verifyToken, async (req, res) => {

    const date = req.body.date;
    const montant = req.body.montant;
    const donneur_id = req.body.donneur_id;
    const receveur_id = req.body.receveur_id;


    if (date && montant && donneur_id && receveur_id) {

        const don = new Don(-1, date, montant, donneur_id, receveur_id);

        let result = await DonController.addDon(don);

        if (result != 500) {

            let donneur = await UserController.getUserByID(donneur_id);
            let receveur = await UserController.getUserByID(receveur_id);
            
            let now = new Date(Date.now());
            let dateT = now.toLocaleString('fr-FR').split(' ');
            let date = dateT.split('-');

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

            await MailController.sendMail("wastemart.company@gmail.com", donneur.mail, "Votre don du " + date[2] + "/" + date[1] + "/" + date[0], messageDonneur);
            await MailController.sendMail("wastemart.company@gmail.com", receveur.mail, "Nouveau don reçu !", messageReceveur);


            return res.status(201).end(); // status created
        }
        else {
            return res.status(500).end();
        }

    }
    else {
        return res.status(400).end();
    }

});


/***********************************************************************************/
/**                                   GET REQUESTS                                **/
/***********************************************************************************/

//Get Functions
router.get('/', verifyToken, async (req, res) => {

    //get all don by donneur_id
    if (req.query.idD) {
        const don = await DonController.getAllDonByDonneurID(req.query.idD);
        if (don != 500) {
            return res.json(don);
        }
        else {
            return res.status(500).end();
        }

    }
    else if (req.query.idR) {
        const don = await DonController.getAllDonByReceveurID(req.query.idR);
        if (don != 500) {
            return res.json(don);
        }
        return res.status(500).end();
    }
    else {

        const don = await DonController.getAllDons();
        if (don != 500) {
            return res.json(don);
        }
        return res.status(500).end();

    }

});

router.get('/last', verifyToken, async (req, res) => {

    if (req.query.idD) {
        const don = await DonController.getLastDonByIdUser(req.query.idD);
        if (don != 500) {
            return res.json(don);
        }
        else {
            return res.status(500).end();
        }

    }
    return res.status(400).end();
});


/***********************************************************************************/
/**                                   DELETE REQUESTS                               **/
/***********************************************************************************/

router.delete('/', verifyToken, async (req, res) => {
    if (req.query.id) {

        const result = await DonController.deleteDon(req.query.id);
        if (result != 500) {
            return res.status(200).end();
        }
        return res.status(500).end();
    }
    return res.status(400).end();
});
module.exports = router;