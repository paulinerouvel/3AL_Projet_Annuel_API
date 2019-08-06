'use strict';

const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const Payement = require('../models/payement_model');
const PayementController = require('../controllers').payementController;


const router = express.Router();
router.use(bodyParser.json());


/***********************************************************************************/
/**                                   POST REQUESTS                               **/
/***********************************************************************************/


router.post('/', verifyToken, async (req, res) => {

    const montant = req.body.montant;
    const titulaire = req.body.titulaire;
    const adresse_facturation = req.body.adresse_facturation;
    const cp_facturation = req.body.cp_facturation;
    const ville_facturation = req.body.ville_facturation;
    const id_don = req.body.id_don;
    const id_commande = req.body.id_commande;

    if (montant && titulaire && adresse_facturation && cp_facturation && ville_facturation && id_don && id_commande) {

        let payement = new Payement(-1, montant, titulaire, adresse_facturation, cp_facturation, ville_facturation, id_don, id_commande);

        let result = await PayementController.addPayement(payement);

        if (result != 500) {
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

router.get('/', verifyToken, async (req, res) => {
    const result = await PayementController.getAllPayement();
    if (result != 500) {
        return res.json(result);
    }
    return res.status(500).end();

});



/***********************************************************************************/
/**                                   DELETE REQUESTS                             **/
/***********************************************************************************/

module.exports = router;