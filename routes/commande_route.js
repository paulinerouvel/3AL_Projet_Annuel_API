'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const CommandeController = require('../controllers').commandeController;
const Commande_Has_Produit = require('../models/commande_has_produit_model');

const router = express.Router();
router.use(bodyParser.json());


/***********************************************************************************/
/**                                   POST REQUESTS                               **/
/***********************************************************************************/

//add an order
router.post('/', async (req, res) => {

    const date = req.body.date;
    const utilisateur_id = req.body.utilisateur_id;

    const idProduct = req.body.idProduct;
    const idCommande = req.body.idCommande;
    const quantite = req.body.quantite;

    if(date != undefined && utilisateur_id != undefined){
        let result = await CommandeController.addOrder(date, utilisateur_id);

        if(result){
            return res.status(201).end(); 
        }
            
        return res.status(408).end();
    }
    if(idProduct != undefined && idCommande != undefined && quantite){

        let chp = new Commande_Has_Produit(idProduct, idCommande, quantite);
        let result = await CommandeController.addProductInOrder(chp);

        if(result){
            return res.status(201).end(); 
        }
        
            
        return res.status(408).end();
    }
    return res.status(400).end();
});


/***********************************************************************************/
/**                                   GET REQUESTS                                **/
/***********************************************************************************/

router.get('/', async (req, res) => {

    //get commande by id user
    if (req.query.idUser) {
        const commandes = await CommandeController.getOrderByIdUser(req.query.idUser);

        if (commandes) {
            return res.json(commandes);
        }
        return res.status(408).end();
    }

    //get commande by id
    else if (req.query.id) {
        const commandes = await CommandeController.getOrderByID(req.query.id);

        if (commandes) {
            return res.json(commandes);
        }
        return res.status(408).end();
    }
    else{
        const commandes = await CommandeController.getAllOrders();

        if (commandes) {
            return res.json(commandes);
        }
        return res.status(408).end();
    }

});

router.get('/last', async (req, res) => {

    //get commande by id user
    if (req.query.idUser) {
        const commandes = await CommandeController.getLastOrderByIdUser(req.query.idUser);

        if (commandes) {
            return res.json(commandes);
        }
        return res.status(408).end();
    }

    return res.status(400).end();

});



router.get('/products', async (req, res)=>{
    const idOrder = req.query.idOrder;

    console.log("test", req.query.dateDebut)

    const dateDebut = req.query.dateDebut;
    const dateFin = req.query.dateFin;
    const idUser = req.query.idUser;
    if(idOrder){
        const products = await CommandeController.getAllProductsInOrder(idOrder);

        if (products) {
            return res.json(products);
        }
        return res.status(408).end();
    }
    else if(dateDebut && dateFin && idUser){
        const total = await CommandeController.getSumOfProductsOrderByUserAndDate(dateDebut, dateFin, idUser);

        if (total) {
            return res.json(total);
        }
        return res.status(408).end();
    }
    return res.status(400).end();
    
});





/***********************************************************************************/
/**                                 DELETE REQUESTS                               **/
/***********************************************************************************/

router.delete('/', async (req, res)=>{
    const id = req.query.id;
    if(id){
        const result = await CommandeController.deleteOrder(id);

        if (result) {
            return res.status(200).end();
        }
        return res.status(500).end();
    }
    return res.status(400).end();
    
});

module.exports = router;