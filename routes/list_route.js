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
router.post('/', verifyToken, async (req, res) => {
    const libelle = req.body.libelle;
    const date = req.body.date;
    const Utilisateur_id = req.body.Utilisateur_id;
    const estArchive = req.body.estArchive;


    if (libelle !== undefined && date !== undefined && Utilisateur_id !== undefined && estArchive !== undefined) {

        const list = new List(-1, libelle, date, Utilisateur_id, estArchive);

        let listRes = await ListController.addList(list);

        if (listRes != 500) {
            return res.status(201).end();
        }
        return res.status(500).end();
    }
    else {
        return res.status(400).end();
    }
});


/***********************************************************************************/
/**                                   PUT  REQUESTS                               **/
/***********************************************************************************/

//Update d'une liste
router.put('/', verifyToken, async (req, res) => {
    const id = req.body.id;
    let libelle = req.body.libelle;
    let date = req.body.date;
    let Utilisateur_id = req.body.Utilisateur_id;
    let estArchive = req.body.estArchive;


    if (id !== undefined && libelle !== undefined && date !== undefined && Utilisateur_id !== undefined
        && estArchive !== undefined) {

        const list = new List(id, libelle, date, Utilisateur_id, estArchive);

        let listRes = await ListController.updateList(list);

        if (listRes != 500) {
            return res.status(200).end(); // status OK
        }
        else {
            return res.status(500).end();
        }
    }
    return res.status(400).end();


});

/***********************************************************************************/
/**                                   GET  REQUESTS                               **/
/***********************************************************************************/


router.get('/', verifyToken, async (req, res) => {

    if (req.query.idUser) {
        const produit = await ListController.getAllListsByUser(req.query.idUser);
        if (produit != 500) {
            return res.json(produit);
        }
        return res.status(500).end();
    }
    else {
        if (req.query.idUserCategory) {
            const produit = await ListController.getAllProductsByUserCategory(req.query.idUserCategory);
            if (produit != 500) {
                return res.json(produit);
            }
            return res.status(500).end();
        }
        //get all lists
        else {
            const produit = await ListController.getAllLists();
            if (produit != 500) {
                return res.json(produit);
            }
            return res.status(500).end();
        }
    }

});

router.get('/products', verifyToken, async (req, res) => {
    if (req.query.id) {
        const produit = await ListController.getAllProductsByList(req.query.id);
        if (produit != 500) {
            return res.json(produit);
        }
        return res.status(500).end();
    }
});

/***********************************************************************************/
/**                                DELETE  REQUESTS                               **/
/***********************************************************************************/
router.delete('/', verifyToken, async (req, res) => {

    if (req.query.id) {
        const list = await ListController.deleteList(req.query.id);
        if (list != 500) {
            return res.json(list);
        }
        return res.status(500).end();
    }
});

module.exports = router;