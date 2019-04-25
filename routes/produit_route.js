'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const ProduitController = require('../controllers').ProduitController;

const router = express.Router();
router.use(bodyParser.json());


// router.get('/', async (req, res) => {

// )};



//Création d'un produit
router.post('/', (req, res, next) => {
    const libelle = req.body.libelle;
    const description = req.body.description;
    const photo = req.body.photo;
    const prix = req.body.prix;
    const reduction = req.body.reduction;
    const dlc = req.body.dlc;
    const codeBarre = req.body.codeBarre;
    const enRayon = req.body.enRayon;
    const dateMiseEnRayon = req.body.dateMiseEnRayon;

    ProduitController.addProduit(libelle, description, photo, prix, reduction, dlc, codeBarre, enRayon, dateMiseEnRayon).then(() =>{
        res.status(201).end(); // status created
    }).catch((err)=> {
        res.status(409).end(); // status conflict
    })
});

module.exports = router;