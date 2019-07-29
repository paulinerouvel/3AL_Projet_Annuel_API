'use strict';

const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const ListController = require('../controllers').listController;
const List = require('../models/liste_produit_model');




const router = express.Router();
router.use(bodyParser.json());


/***********************************************************************************/
/**                                   POST REQUESTS                               **/
/***********************************************************************************/

//Création d'une liste
router.post('/', async (req, res) => {
    const libelle = req.body.libelle;
    const date = req.body.date;
    const Utilisateur_id = req.body.Utilisateur_id;
    const estArchive = req.body.estArchive;


    if (libelle !== undefined && date !== undefined && Utilisateur_id !== undefined && estArchive !== undefined) {

        const list = new List(-1, libelle, date, Utilisateur_id, estArchive);

        let listRes = await ListController.addList(list);

        if(listRes){
            return res.status(201).end();
        }
        return res.status(408).end();
    }
    else {
        res.status(400).end();
    }
});


/***********************************************************************************/
/**                                   PUT  REQUESTS                               **/
/***********************************************************************************/

//Update d'une liste
router.put('/', async (req, res) => {
    const id = req.body.id;
    let libelle = req.body.libelle;
    let date = req.body.date;
    let Utilisateur_id = req.body.Utilisateur_id;
    let estArchive = req.body.estArchive;

    console.log(
        req.body.id,
        req.body.libelle,
        req.body.date,
        req.body.Utilisateur_id,
        req.body.estArchive,
    );

    if(id !== undefined && libelle !== undefined && date !== undefined && Utilisateur_id !== undefined
        && estArchive !== undefined){

        const list = new List(id, libelle, date, Utilisateur_id, estArchive);

        let listRes = await ListController.updateList(list);

        if(listRes){
            return res.status(200).end(); // status OK
        }
        else{
            return res.status(409).end(); // status conflict
        }
    }
    return res.status(400).end();


});

    /***********************************************************************************/
    /**                                   GET  REQUESTS                               **/
    /***********************************************************************************/


router.get('/', async (req, res) => {
    //get all list by User
    if (req.query.idUser) {
        const produit = await ListController.getAllListsByUser(req.query.idUser);
        if (produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }
    else {
        if (req.query.idUserCategory) {
            const produit = await ListController.getAllProductsByUserCategory(req.query.idUserCategory);
            console.log("ouioui");
            if(produit) {
                return res.json(produit);
            }
            return res.status(408).end();
        }
        //get all lists
        else {
            const produit = await ListController.getAllLists();
            console.log("nonnon");
            if (produit) {
                return res.json(produit);
            }
            return res.status(408).end();
    }
    }
    
});

router.get('/products', async (req, res) => {
    //get all product by list
    if (req.query.id) {
        const produit = await ListController.getAllProductsByList(req.query.id);
        if (produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }
});

/***********************************************************************************/
/**                                DELETE  REQUESTS                               **/
/***********************************************************************************/
router.delete('/', async (req, res) => {
    //delete list by id
    if (req.query.id) {
        const list = await ListController.deleteList(req.query.id);
        if (list) {
            return res.json(list);
        }
        return res.status(408).end();
    }
});

module.exports = router;