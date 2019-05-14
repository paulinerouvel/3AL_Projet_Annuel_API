'use strict';

const jwtUtils = require('../utils/jwt.utils')
const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const Alert = require('../models/alerte_model');
const AlerteController = require('../controllers').alerteController;


const router = express.Router();
router.use(bodyParser.json());


//Création d'une alerte
router.post('/', async (req, res) => {

    const libelle = req.body.libelle;
    const date = req.body.date;
    const utilisateur_id = req.body.utilisateur_id;
    

    const alert = new Alert (-1, libelle, date, utilisateur_id);

    AlerteController.addAlerte(alert).then(() =>{
        res.status(201).end(); // status created
    }).catch((err)=> {
        console.log(err);
        res.status(409).end(); // status conflict
    })
    
});

//Get Functions
router.get('/', async (req, res) => {

    //get all alerts by user_id
    if(req.query.id)
    {
        console.log("j'essaye de get les alert par user id");
        console.log(req.query.id);
        const alert = await AlerteController.getAllAlertByUserID(req.query.id);
        if(alert) {
            return res.json(alert);
        }
        return res.status(408).end();
    }

    else if (req.body.date != undefined) // Pour l'instant ça marche pas bc l'enregistrement en base est un peu chelou (pour la date)
    {
        console.log(req.body.date);
        const alert = await AlerteController.getAlertOfTheDay(req.query.date);
        if(alert) {
            return res.json(alert);
        }
        return res.status(408).end();
    }
    else {
        {
            const alert = await AlerteController.getAllAlerts();
            if(alert) {
                return res.json(alert);
            }
            return res.status(408).end();
        }
    }

 });


// PUT FUNCTION

// No PUT FUNCTION

// DELETE FUNCTION
router.delete('/:id/:idUser', async (req, res) => {
    if(req.params.id !== undefined){
        console.log("route delete");
        console.log(req.params.id, + "\n" + req.params.idUser);
        const result = await AlerteController.deleteAlert(req.params.id, req.params.idUser);
        if(result){
            return res.status(200).end();
        }
        return res.status(408).end();
    }
    res.status(400).end();
});
module.exports = router;