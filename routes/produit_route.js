'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const ProduitController = require('../controllers').produitController;
const AlertController = require('../controllers').alerteController;
const MailController = require('../controllers').mailController;
const UserController = require('../controllers').utilisateurController;
const Produit = require('../models/produit_model');

const router = express.Router();
router.use(bodyParser.json());

function no_accent (my_string) {
    var rules = {
        'a': /[àáâãäå]+/g,
        'ae': /[æ]+/g,
        'c': /[ç]+/g,
        'e': /[èéêë]+/g,
        'i': /[ìíîï]+/g,
        'n': /[ñ]+/g,
        'o': /[òóôõö]+/g,
        'oe': /[œ]+/g,
        'u': /[ùúûü]+/g,
        'y': /[ýÿ]+/g,
        '_': /[\s\\]+/g
    }
     

    my_string = my_string.toLowerCase();
    for (var r in rules) my_string = my_string.replace(rules[r], r);
    return my_string;
}

/***********************************************************************************/
/**                                   POST REQUESTS                               **/
/***********************************************************************************/

//Création d'un produit
router.post('/', async (req, res) => {
    let libelle = req.body.libelle;
    let desc = req.body.desc;
    const photo = req.body.photo;
    const prix = req.body.prix;
    const prixInitial = req.body.prixInitial;
    const quantite = req.body.quantite;
    const dlc = req.body.dlc || null;
    const codeBarre = req.body.codeBarre || null;
    const enRayon = req.body.enRayon;
    const dateMiseEnRayon = req.body.dateMiseEnRayon || null;
    const categorieProduit_id = req.body.categorieProduit_id;
    const listProduct_id = req.body.listProduct_id || null;
    const entrepotwm_id = req.body.entrepotwm_id || null;
    const destinataire = req.body.destinataire || null;

    let produitsRes = await ProduitController.addProduct(libelle, desc, photo, prix, prixInitial, quantite, dlc, codeBarre, enRayon, dateMiseEnRayon, categorieProduit_id, listProduct_id, entrepotwm_id, destinataire);


    if (produitsRes) {
        let allAlerts = await AlertController.getAllAlerts();


        for (const alert of allAlerts) {

            libelle = no_accent(libelle);
            desc = no_accent(desc);
            alert.libelle = no_accent(alert.libelle);

            let indexLibelle = libelle.search(alert.libelle);
            let indexDesc = desc.search(alert.libelle);

            if(indexLibelle != -1 || indexDesc != -1){
                let user = await UserController.getUserByID(alert.utilisateur_id);

                await MailController.sendMail("wastemart@gmail.com", user.mail, "Votre alerte " + alert.libelle,
                    "Bonjour,<br/> Le produit " + libelle + " correspond à votre alerte " + alert.libelle + " ! <br/> Foncez sur WasteMart pour le mettre dans votre panier ! <br/> Cordialement, <br/> L'équipe WasteMart");
    
            } 

        }

        res.status(201).end(); // status created
    }
    else {
        console.log(err);
        res.status(409).end(); // status conflict
    }
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

/***********************************************************************************/
/**                                   PUT  REQUESTS                               **/
/***********************************************************************************/
router.put('/', async (req, res) => {
    const id = req.body.id;
    let libelle = req.body.libelle;
    let desc = req.body.desc;
    let photo = req.body.photo;
    let prix = req.body.prix;
    let prixInitial = req.body.prixInitial;
    let quantite = req.body.quantite;
    let dlc = req.body.dlc;
    let codeBarre = req.body.codeBarre;
    let enRayon = req.body.enRayon;
    let dateMiseEnRayon = req.body.dateMiseEnRayon ;
    let categorieProduit_id = req.body.categorieProduit_id;
    let listProduct_id = req.body.listProduct_id;
    let entrepotwm_id = req.body.entrepotwm_id;
    let destinataire = req.body.destinataire;




    if(id != undefined && libelle != undefined && desc != undefined && photo != undefined && prix != undefined &&
        prixInitial != undefined && quantite != undefined && enRayon != undefined && categorieProduit_id != undefined
        && listProduct_id != undefined){

        const product = new Produit(id, libelle, desc, photo, prix, prixInitial, quantite, dlc,
            codeBarre, enRayon, dateMiseEnRayon, categorieProduit_id, listProduct_id, entrepotwm_id, destinataire);

        let productRes = await ProduitController.updateProduct(product);
        
        if( productRes){
            return res.status(200).end(); // status OK
        }
        else{
            return res.status(409).end(); // status conflict
        }

    }
    return res.status(400).end();


});


router.put('/warehouse', async (req, res) => {

    let idProduct = req.body.idProduct;
    let idWarehouse = req.body.idWarehouse;

    if(idProduct && idWarehouse) {
        let result = await ProduitController.updateProductWarehouse(idProduct, idWarehouse);

        if(result) {
            return res.status(200).end(); // status ok
        }
        else {
            return res.status(409).end(); // status conflict
        }
    }
    return res.status(400).end();
});

/***********************************************************************************/
/**                                   GET  REQUESTS                               **/
/***********************************************************************************/
router.get('/', async (req, res) => {
    //get product by id
    if (req.query.id) {
        const produit = await ProduitController.getProductByID(req.query.id);
        if (produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }

    return res.status(400).end();
});

router.get('/warehouse', async (req, res) => {
    //get product by warehouse_id
    if (req.query.id) {
        const produit = await ProduitController.getAllProductsByWarehouse(req.query.id);
        if (produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }
    else if (req.query.idOrder) {
            const produit = await ProduitController.getProductOfAnOrder(req.query.idOrder);
            if (produit) {
                return res.json(produit);
            }
            return res.status(408).end();
        }
    }
);

router.get('/enRayon', async (req, res) => {

    if (req.query.name && req.query.dest) {
        const produit = await ProduitController.getProductByNameAndDest(req.query.name, req.query.dest);
        if (produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }
    else if (req.query.idCategorie && req.query.dest) {
        const produit = await ProduitController.getProductByCategorieAndDest(req.query.idCategorie, req.query.dest);
        if (produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }
    else if (req.query.prixMin && req.query.prixMax && req.query.dest) {
        const produit = await ProduitController.getProductByPrixAndDest(req.query.prixMin, req.query.prixMax, req.query.dest);
        if (produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }
    else if (req.query.dest) {
        const produit = await ProduitController.getAllProductsEnRayonByDest(req.query.dest);

        if (produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }

    return res.status(400).end();

});


router.get('/category', async (req, res) => {


    const produit = await ProduitController.getAllProductCategories();
    if (produit) {
        return res.json(produit);
    }
    return res.status(408).end();
    
});




/***********************************************************************************/
/**                                DELETE  REQUESTS                               **/
/***********************************************************************************/
router.delete('/', async (req, res) => {
    //delete product by id
    if (req.query.id) {
        const produit = await ProduitController.deleteProduct(req.query.id);
        if (produit) {
            return res.json(produit);
        }
        return res.status(408).end();
    }
});

module.exports = router;