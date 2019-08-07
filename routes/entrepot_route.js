'use strict';


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
router.post('/', verifyToken, async (req, res) => {

    const libelle = req.body.libelle;
    const adresse = req.body.adresse;
    const ville = req.body.ville;
    const codePostal = req.body.codePostal;
    const desc = req.body.desc;
    const photo = req.body.photo;
    const placeTotal = req.body.placeTotal;
    const placeLibre = req.body.placeLibre;

    if (libelle && adresse && ville && codePostal ) {
        const warehouse = new Entrepot(-1, libelle, adresse, ville, codePostal, desc, photo, placeTotal, placeLibre);

        let result = await EntrepotController.addWarehouse(warehouse);

        if (result != 500) {
            return res.status(201).end(); // status created
        }
        else {
            return res.status(500);
        }

    }
    else {
        return res.status(400).end();
    }



});



/***********************************************************************************/
/**                                   GET  REQUESTS                               **/
/***********************************************************************************/

//Get Functions
router.get('/', async (req, res) => {

    //get entrepot by id
    if (req.query.id) {
        const warehouse = await EntrepotController.getWarehouseByID(req.query.id);
        if (warehouse != 500) {
            return res.json(warehouse);
        }
        return res.status(500).end();
    }

    //get entrepot by ville
    else if (req.query.city !== undefined) {
        const warehouse = await EntrepotController.getWarehouseByCity(req.query.city);
        if (warehouse != 500) {
            return res.json(warehouse);
        }
        return res.status(500).end();
    }

    //get all entrepots
    else {
        const warehouses = await EntrepotController.getAllWarehouse();
        if (warehouses != 500) {
            return res.json(warehouses);
        }
        return res.status(500).end();
    }

});


/***********************************************************************************/
/**                                   PUT  REQUESTS                               **/
/***********************************************************************************/

//Update d'un entrepot
router.put('/', verifyToken, async (req, res) => {

    let id = req.body.id;
    const libelle = req.body.libelle;
    const adresse = req.body.adresse;
    const ville = req.body.ville;
    const codePostal = req.body.codePostal;
    const desc = req.body.desc;
    const photo = req.body.photo;
    const placeTotal = req.body.placeTotal;
    const placeLibre = req.body.placeLibre;

    if (id && libelle && adresse && ville && codePostal ) {

        const warehouse = new Entrepot(id, libelle, adresse, ville, codePostal, desc, photo, placeTotal, placeLibre);

        let result = await EntrepotController.updateWarehouse(warehouse);

        if (result != 500) {
            return res.status(200).end(); // status OK
        }
        else {
            return res.status(500).end();
        }

    }
    else {
        return res.status(400).end();
    }

});

/***********************************************************************************/
/**                                 DELETE REQUESTS                               **/
/***********************************************************************************/
router.delete('/:id', verifyToken, async (req, res) => {


    if (req.params.id !== undefined) {
        let result = await EntrepotController.deleteWarehouse(req.params.id);
        if (result != 500) {
            return res.status(200).end();
        }
        return res.status(500).end();
    }
    return res.status(400).end();
});
module.exports = router;