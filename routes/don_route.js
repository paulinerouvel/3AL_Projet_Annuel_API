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

    const idDon = req.body.idDon;


    if (date && montant && donneur_id && receveur_id) {

        const don = new Don(-1, date, montant, donneur_id, receveur_id);

        let result = await DonController.addDon(don);

         


        if (result != 500) {


            return res.status(201).end(); // status created
        }
        else {
            return res.status(500).end();
        }

    }

    if (idDon) {

 
        let result = await DonController.sendMailAndFacture(idDon);

        if (result == 500) {

            return res.status(500).end();
        }
        else {

            return res.status(201).end();
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