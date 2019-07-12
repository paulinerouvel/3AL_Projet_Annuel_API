'use strict';

const jwtUtils = require('../utils/jwt.utils')
const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const EntrepotController = require('../controllers/entrepot_controller')
const Entrepot = require('../models/entrepot_model');


const router = express.Router();
router.use(bodyParser.json());

    /***********************************************************************************/
    /**                                   POST REQUESTS                               **/
    /***********************************************************************************/

//Création d'un entrepot
router.post('/', async (req, res) => {

    const libelle = req.body.libelle;
    const adresse = req.body.adresse;
    const ville = req.body.ville;
    const codePostal = req.body.codePostal;
    const desc = req.body.desc;
    const photo = req.body.photo;
    const placeTotal = req.body.placeTotal;
    const placeLibre = req.body.placeLibre;

    const warehouse = new Entrepot(-1, libelle, adresse, ville, codePostal, desc, photo, placeTotal, placeLibre);

    EntrepotController.addWarehouse(warehouse).then(() => {
        res.status(201).end(); // status created
    }).catch((err) => {
        console.log(err);
        res.status(409).end(); // status conflict
    })

});



    /***********************************************************************************/
    /**                                   GET  REQUESTS                               **/
    /***********************************************************************************/

//Get Functions
router.get('/', async (req, res) => {

    //get entrepot by id
    if (req.query.id) {
        const warehouse = await EntrepotController.getWarehouseByID(req.query.id);
        if (warehouse) {
            return res.json(warehouse);
        }
        return res.status(408).end();
    }

    //get entrepot by ville
    else if (req.query.city !== undefined) {
        console.log("city");
        const warehouse = await EntrepotController.getWarehouseByCity(req.query.city);
        if (warehouse) {
            return res.json(warehouse);
        }
        return res.status(408).end();
    }

    //get all entrepots
    else {
        console.log("get all entrepot");
        const warehouses = await EntrepotController.getAllWarehouse();
        if (warehouses) {
            return res.json(warehouses);
        }
        return res.status(408).end();
    }

});


    /***********************************************************************************/
    /**                                   PUT  REQUESTS                               **/
    /***********************************************************************************/

//Update d'un entrepot
router.put('/', async (req, res) => {

    let id = req.body.id;
    const libelle = req.body.libelle;
    const adresse = req.body.adresse;
    const ville = req.body.ville;
    const codePostal = req.body.codePostal;
    const desc = req.body.desc;
    const photo = req.body.photo;
    const placeTotal = req.body.placeTotal;
    const placeLibre = req.body.placeLibre;


    const warehouse = new Entrepot(id, libelle, adresse, ville, codePostal, desc, photo, placeTotal, placeLibre);

    EntrepotController.updateWarehouse(warehouse).then(() => {
        res.status(200).end(); // status OK
    }).catch((err) => {
        console.log(err);
        res.status(409).end(); // status conflict
    })

});

    /***********************************************************************************/
    /**                                 DELETE REQUESTS                               **/
    /***********************************************************************************/
router.delete('/:id', async (req, res) => {
    if (req.params.id !== undefined) {
        let a = await EntrepotController.deleteWarehouse(req.params.id);
        if (a) {
            return res.status(200).end();
        }
        return res.status(408).end();
    }
    res.status(400).end();
});
module.exports = router;