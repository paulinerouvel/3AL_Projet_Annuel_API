'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const AssociationController = require('../controllers/association_controllers');

const router = express.Router();
router.use(bodyParser.json());



    /***********************************************************************************/
    /**                                   POST REQUESTS                               **/
    /***********************************************************************************/

//Création d'une association
router.post('/', (req, res, next) => {

    const libelle = req.body.libelle;
    console.log(libelle);
    const taille = req.body.taille;
    const adresse = req.body.taille;
    const ville = req.body.ville;
    const codePostal = req.body.codePostal;
    const mail = req.body.mail;
    const tel = req.body.tel;
    const nomPresident = req.body.nomPresident;
    const prenomPresident = req.body.prenomPresident;
    const photo = req.body.photo;
    const desc = req.body.desc;

    AssociationController.addAssociation(libelle, taille, adresse, ville, codePostal, mail, tel, nomPresident, prenomPresident, photo, desc).then(() => {
        res.status(201).end(); // status created
    }).catch((err) => {
        console.log(err);
        res.status(409).end(); // status conflict
    })
});

module.exports = router;