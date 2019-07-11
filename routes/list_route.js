'use strict';

const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const ListController = require('../controllers').listController;



const router = express.Router();
router.use(bodyParser.json());


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



module.exports = router;