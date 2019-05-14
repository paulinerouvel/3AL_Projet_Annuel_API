'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const ProduitController = require('../controllers').produitController;

const router = express.Router();
router.use(bodyParser.json());


// router.get('/', async (req, res) => {

// )};


//Création d'un produit
router.post('/', (req, res, next) => {
    const libelle = req.body.libelle;
    const desc = req.body.desc;
    const photo = req.body.photo;
    const prix = req.body.prix;
    const reduction = req.body.reduction;
    const dlc = req.body.dlc;
    const codeBarre = req.body.codeBarre;
    const enRayon = req.body.enRayon;
    const dateMiseEnRayon = req.body.dateMiseEnRayon || null;
    const categorieProduit_id = req.body.categorieProduit_id;
    const listProduct_id = req.body.listProduct_id
    const entrepotwm_id = req.body.entrepotwm_id

    ProduitController.addProduct(libelle, desc, photo, prix, reduction, dlc, codeBarre, enRayon, dateMiseEnRayon, categorieProduit_id, listProduct_id, entrepotwm_id).then(() =>{
        res.status(201).end(); // status created
    }).catch((err)=> {
        console.log(err);
        res.status(409).end(); // status conflict
    })
});

// Création d'une catégorie de produit
router.post('/Category', (req, res, next) => {

    const libelle = req.body.libelle;

    ProduitController.addProductCategory(libelle).then(() => {
        res.status(201).end(); // status created
    }).catch((err) => {
        console.log(err);
        res.status(409).end(); // status conflict
    })

});

// FUNCTIONS GET DES PRODUITS
router.get('/', async (req, res) => {
    //get product by id
    if(req.query.id)
    {
        const produit = await ProduitController.getProductByID(req.query.id);
        if(produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }
 });

 router.get('/warehouse', async (req, res) => {
    //get product by warehouse_id
    if(req.query.id)
    {
        const produit = await ProduitController.getAllProductsByWarehouse(req.query.id);
        if(produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }
 });

 router.get('/enRayon', async (req, res) => {
//get all products en rayon
    const produit = await ProduitController.getAllProductsEnRayon()
     if(produit) {
         return res.json(produit);
     }
     return res.status(408).end();
 })

module.exports = router;