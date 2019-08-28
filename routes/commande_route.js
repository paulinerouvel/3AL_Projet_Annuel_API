'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const CommandeController = require('../controllers').commandeController;
const Commande_Has_Produit = require('../models/commande_has_produit_model');
const verifyToken = require('../utils/jwt.utils').verifyToken;


const router = express.Router();
router.use(bodyParser.json());


/***********************************************************************************/
/**                                   POST REQUESTS                               **/
/***********************************************************************************/

//add an order
router.post('/', verifyToken, async (req, res) => {

    const date = req.body.date;
    const utilisateur_id = req.body.utilisateur_id;
    const adresse_livraison = req.body.adresse_livraison;
    const cp_livraison = req.body.cp_livraison;
    const ville_livraison = req.body.ville_livraison;

    const idProduct = req.body.idProduct;
    const idCommande = req.body.idCommande;
    const quantite = req.body.quantite;

    const idCmd = req.body.idCmd;

    if (date && utilisateur_id && adresse_livraison && cp_livraison && ville_livraison) {
        let result = await CommandeController.addOrder(date, utilisateur_id, adresse_livraison, cp_livraison, ville_livraison);

        if (result == 500) {
            return res.status(500).end();

        }
        else {
            return res.status(201).end();
        }


    }
    if (idProduct && idCommande && quantite) {

        let chp = new Commande_Has_Produit(idProduct, idCommande, quantite);
        let result = await CommandeController.addProductInOrder(chp);

        if (result == 500) {

            return res.status(500).end();
        }
        else {

            return res.status(201).end();
        }

    }
    

    if (idCmd) {

 
        let result = await CommandeController.sendMailAndFacture(idCmd);

        if (result == 500) {

            return res.status(500).end();
        }
        else {

            return res.status(201).end();
        }

    }
    return res.status(400).end();
});





/***********************************************************************************/
/**                                   GET REQUESTS                                **/
/***********************************************************************************/

router.get('/', verifyToken, async (req, res) => {

    //get commande by id user
    if (req.query.idUser) {
        const commandes = await CommandeController.getOrderByIdUser(req.query.idUser);

        if (commandes == 500) {
            return res.status(500).end();

        }
        else {
            return res.json(commandes);
        }

    }

    //get commande by id
    else if (req.query.id) {
        const commandes = await CommandeController.getOrderByID(req.query.id);

        if (commandes == 500) {
            return res.status(500).end();

        }
        else {
            return res.json(commandes);
        }

    }
    else {
        const commandes = await CommandeController.getAllOrders();

        if (commandes == 500) {
            return res.status(500).end();
        }
        else {
            return res.json(commandes);
        }

    }

});

router.get('/last', verifyToken, async (req, res) => {

    //last commande of a user
    if (req.query.idUser) {
        const commandes = await CommandeController.getLastOrderByIdUser(req.query.idUser);

        if (commandes == 500) {
            return res.status(500).end();

        }
        else {
            return res.json(commandes);
        }

    }

    return res.status(400).end();

});



router.get('/products', verifyToken, async (req, res) => {

    const idOrder = req.query.idOrder;


    const dateDebut = req.query.dateDebut;
    const dateFin = req.query.dateFin;
    const idUser = req.query.idUser;

    if (idOrder) {
        const products = await CommandeController.getAllProductsInOrder(idOrder);

        if (products != 500) {
            return res.json(products);
        }
        else {
            return res.status(500).end();
        }

    }
    else if (dateDebut && dateFin && idUser) {
        const total = await CommandeController.getSumOfProductsOrderByUserAndDate(dateDebut, dateFin, idUser);

        if (total != 500) {
            if (total == 0) {
                return res.json([{ total: 0 }])
            }
            return res.json(total);
        }
        else {
            return res.status(500).end();
        }

    }
    return res.status(400).end();

});





/***********************************************************************************/
/**                                 DELETE REQUESTS                               **/
/***********************************************************************************/

router.delete('/', verifyToken, async (req, res) => {
    const id = req.query.id;
    if (id) {
        const result = await CommandeController.deleteOrder(id);

        if (result != 500) {
            return res.status(200).end();
        }
        return res.status(500).end();
    }
    return res.status(400).end();

});

module.exports = router;