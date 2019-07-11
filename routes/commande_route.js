'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const CommandeController = require('../controllers').commandeController;

const router = express.Router();
router.use(bodyParser.json());


    /***********************************************************************************/
    /**                                   POST REQUESTS                               **/
    /***********************************************************************************/
router.post('/', (req, res, next) => {
    const date = req.body.date;
    const utilisateurID = req.body.utilisateurID;
    CommandeController.addOrder(date, utilisateurID).then(() => {
        res.status(201).end(); // status created
    }).catch((err) => {
        res.status(409).end()
    })
});

router.get('/', async (req, res) => {

    //get commande by id user
    if (req.query.idUser) {
        const commandes = await CommandeController.getOrderByIdUser(req.query.idUser);
        if (commandes) {
            return res.json(commandes);
        }
        return res.status(408).end();
    }
});




module.exports = router;