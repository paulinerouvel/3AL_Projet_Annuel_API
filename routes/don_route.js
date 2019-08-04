'use strict';

const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const Don = require('../models/don_model');
const DonController = require('../controllers').donController


const router = express.Router();
router.use(bodyParser.json());


    /***********************************************************************************/
    /**                                   POST REQUESTS                               **/
    /***********************************************************************************/


//Création d'un don
router.post('/', async (req, res) => {

    const date = req.body.date;
    const montant = req.body.montant;
    const donneur_id = req.body.donneur_id;
    const receveur_id = req.body.receveur_id;

    if(date && montant && donneur_id && receveur_id){
        
        const don = new Don(-1, date, montant, donneur_id, receveur_id);

        let result = await DonController.addDon(don);

        if(result != 500){
            return res.status(201).end(); // status created
        }
        else{
            return res.status(500).end(); 
        }   

    }
    else{
        return res.status(400).end();
    }


});


    /***********************************************************************************/
    /**                                   GET REQUESTS                                **/
    /***********************************************************************************/

//Get Functions
router.get('/', async (req, res) => {

    //get all don by donneur_id
    if (req.query.idD) {
        const don = await DonController.getAllDonByDonneurID(req.query.idD);
        if (don != 500) {
            return res.json(don);
        }
        else{
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



    /***********************************************************************************/
    /**                                   DELETE REQUESTS                               **/
    /***********************************************************************************/

router.delete('/:id/:alerte_id', async (req, res) => {
    if (req.params.id !== undefined && req.params.alerte_id != undefined) {

        const result = await MotCleController.deleteMotCle(req.params.id, req.params.alerte_id);
        if (result != 500) {
            return res.status(200).end();
        }
        return res.status(500).end();
    }
    res.status(400).end();
});
module.exports = router;