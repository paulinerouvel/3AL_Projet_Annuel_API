'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const commandeController = require('../controllers').commandeController;

const router = express.Router();
router.use(bodyParser.json());

//Création d'un produit
router.post('/', (req, res, next) => {
    const date = req.body.date;
    const utilisateurID = req.body.utilisateurID;
    
    commandeController.addCommande(date, utilisateurID).then(()=> {
        res.status(201).end(); // status created
    }).catch((err)=>{
        res.status(409).end()
    })
    ProduitController.addProduit(libelle, description, photo, prix, reduction, dlc, codeBarre, enRayon, dateMiseEnRayon).then(() =>{
        res.status(201).end(); // status created
    }).catch((err)=> {
        res.status(409).end(); // status conflict
    })
});

module.exports = router;