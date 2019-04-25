'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const UtilisateurController = require('../controllers/utilisateur_controller');
const Utilisateur = require('../models/utilisateur_model');


const router = express.Router();
router.use(bodyParser.json());


//Get d'un utilisateur avec son nom...

router.get('/', async (req, res) => {

    //get user by id
    if(req.query.id)
    {
        const user = await UtilisateurController.getUserByID(req.query.id);
        if(user) {
            return res.json(user);
        }
        return res.status(408).end();
    }
 
    //get user by mail
    else if(req.body.mail !== undefined){
         const user = await UtilisateurController.getUserByEmail(req.body.mail);
         if(user) {
             return res.json(user);
         }
         return res.status(408).end();
     }

     //get all users
     else {
         const users = await UtilisateurController.getAllUsers();
         if(users){
             return res.json(users);
         }
         return res.status(408).end();
     }
 
 });


//Création d'un utilisateur 
router.post('/register', async (req, res) => {

        const libelle = req.body.libelle;
        const nom = req.body.nom;
        const prenom = req.body.prenom;
        const mail = req.body.mail;
        const tel=req.body.tel;
        const adresse = req.body.adresse;
        const ville = req.body.ville;
        const codePostal = req.body.codePostal;
        const pseudo = req.body.pseudo;
        const mdp = req.body.mdp;
        const photo = req.body.photo;
        const desc= req.body.desc;
        const tailleOrganisme = req.body.tailleOrganisme;
        const statut = req.body.statut;
        const siret = req.body.siret;
        const dateDeNaissance = req.body.dateDeNaissance;
        const nbPointsSourire = req.body.nbPointsSourire;

        const user = new Utilisateur(-1, libelle, nom, prenom, mail, tel, adresse, ville, 
            codePostal, pseudo, mdp , photo, desc, tailleOrganisme, statut, siret, dateDeNaissance, nbPointsSourire);
        
        UtilisateurController.addUser(user).then(() => {
            res.status(201).end(); // status created
        }).catch((err)=> {
            console.log(err);
            res.status(409).end(); // status conflict
        })
    
});

module.exports = router;