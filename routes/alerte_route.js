'use strict';

const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const Alert = require('../models/alerte_model');
const AlerteController = require('../controllers').alerteController;


const router = express.Router();
router.use(bodyParser.json());


/***********************************************************************************/
/**                                   POST REQUESTS                               **/
/***********************************************************************************/


//Création d'une alerte
router.post('/', verifyToken, async (req, res) => {

    const libelle = req.body.libelle;
    const date = req.body.date;
    const utilisateur_id = req.body.utilisateur_id;

    if (libelle && date && utilisateur_id) {

        const alert = new Alert(-1, libelle, date, utilisateur_id);

        let response = await AlerteController.addAlerte(alert);

        if (response == 500) {
            return res.status(500).end();
        }
        else {
            return res.status(201).end(); // status created
        }

    }
    return res.status(400).end();

});


/***********************************************************************************/
/**                                   GET REQUESTS                                **/
/***********************************************************************************/

router.get('/', verifyToken, async (req, res) => {

    //get all alerts by user_id
    if (req.query.id) {
        const alert = await AlerteController.getAllAlertByUserID(req.query.id);

        if (alert == 500) {
            return res.status(500).end();
        }
        else {
            return res.json(alert);
        }
    }

    else if (req.body.date ) {
        const alert = await AlerteController.getAlertOfTheDay(req.query.date);
        if (alert == 500) {
            return res.status(500).end();

        }
        else {
            return res.json(alert);
        }

    }
    else {
        {
            const alert = await AlerteController.getAllAlerts();
            if (alert == 500) {
                return res.status(500).end();

            }
            else {
                return res.json(alert);
            }

        }
    }

});


/***********************************************************************************/
/**                                 DELETE REQUESTS                               **/
/***********************************************************************************/
router.delete('/', verifyToken, async (req, res) => {
    if (req.query.id !== undefined) {
        const result = await AlerteController.deleteAlert(req.query.id);
        if (result == 500) {
            return res.status(500).end();
        }
        else {
            return res.status(200).end();
        }

    }
    return res.status(400).end();
});

module.exports = router;