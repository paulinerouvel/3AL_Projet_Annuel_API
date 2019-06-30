'use strict';

const jwtUtils = require('../utils/jwt.utils')
const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const MotCle = require('../models/motCle_model')
const MotCleController = require('../controllers').motCleController


const router = express.Router();
router.use(bodyParser.json());


    /***********************************************************************************/
    /**                                   POST REQUESTS                               **/
    /***********************************************************************************/

//Création d'un mot clé
router.post('/', async (req, res) => {

    const libelle = req.body.libelle;
    const alerte_id = req.body.alerte_id;


    const motCle = new MotCle(-1, libelle, alerte_id);

    MotCleController.addMotCle(motCle).then(() => {
        res.status(201).end(); // status created
    }).catch((err) => {
        console.log(err);
        res.status(409).end(); // status conflict
    })

});




    /***********************************************************************************/
    /**                                   GET REQUESTS                               **/
    /***********************************************************************************/
router.get('/', async (req, res) => {

    //get all mot clés by alerte_id
    if (req.query.id) {
        console.log("j'essaye de get les mots clés par alerte id");
        const motCle = await MotCleController.getMotCleByAlert_ID(req.query.id);
        if (motCle) {
            return res.json(motCle);
        }
        return res.status(408).end();
    }
    else {
        {
            const motCle = await MotCleController.getAllMotCle();
            if (motCle) {
                return res.json(motCle);
            }
            return res.status(408).end();
        }
    }

});


    /***********************************************************************************/
    /**                                  DELETE REQUESTS                               **/
    /***********************************************************************************/
router.delete('/:id/:alerte_id', async (req, res) => {
    if (req.params.id !== undefined) {
        console.log("route delete");
        const result = await MotCleController.deleteMotCle(req.params.id, req.params.alerte_id);
        if (result) {
            return res.status(200).end();
        }
        return res.status(408).end();
    }
    res.status(400).end();
});
module.exports = router;