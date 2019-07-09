'use strict';

const jwtUtils = require('../utils/jwt.utils')
const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const UtilisateurController = require('../controllers/utilisateur_controller');
const Utilisateur = require('../models/utilisateur_model');

const router = express.Router();
router.use(bodyParser.json());

/***********************************************************************************/
/**                                   POST REQUESTS                               **/
/***********************************************************************************/
//Création d'un particulier
router.post('/register', async (req, res) => {

    const libelle = req.body.libelle;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const mail = req.body.mail;
    const tel = req.body.tel;
    const adresse = req.body.adresse;
    const ville = req.body.ville;
    const codePostal = req.body.codePostal;
    const pseudo = req.body.pseudo;
    let mdp = req.body.mdp;
    const photo = req.body.photo;
    const desc = req.body.desc;
    const tailleOrganisme = req.body.tailleOrganisme;
    const estValide = req.body.estValide;
    const siret = req.body.siret;
    const dateDeNaissance = req.body.dateDeNaissance;
    const nbPointsSourire = req.body.nbPointsSourire;

    let cryptedPass = await bcrypt.hashSync(mdp, 5);
    try {
        mdp = cryptedPass;
    }
    catch (err) {
        console.log(err);
        res.status(409).end(); // status conflict
    }


    if (libelle != undefined && nom != undefined && prenom != undefined && mail != undefined && tel != undefined && adresse != undefined
        && ville != undefined && codePostal != undefined && pseudo != undefined && mdp != undefined && photo != undefined && desc != undefined
        && tailleOrganisme != undefined && estValide != undefined && siret != undefined && dateDeNaissance != undefined && nbPointsSourire != undefined) {

        const user = new Utilisateur(-1, libelle, nom, prenom, mail, tel, adresse, ville,
            codePostal, pseudo, mdp, photo, desc, tailleOrganisme, estValide, siret, dateDeNaissance, nbPointsSourire);


        UtilisateurController.addUser(user).then(() => {
            res.status(201).end(); // status created
        }).catch((err) => {
            console.log(err);
            res.status(409).end(); // status conflict
        });
    }
    else {
        res.status(400).end();
    }
});


//login
router.post('/login', async (req, res) => {
    console.log("je rentre post/login");

    let mail = req.body.mail;
    let mot_de_passe = req.body.mdp;

    if (mail != undefined && mot_de_passe != undefined) {

        let userFound = await UtilisateurController.getUserByEmail(mail);

        if (userFound != undefined && userFound.estValide == 1) {

            let userCategory = await UtilisateurController.getUserCategory(userFound.id);
            console.log("user category :", userCategory)
            bcrypt.compare(mot_de_passe, userFound.mdp, function (errBycrypt, resBycrypt) {
                if (resBycrypt) {
                    return res.status(200).json({
                        'userId': userFound.id,
                        'userCategory': userCategory,
                        // 'typeUtil': userFound.status, normalement c'est pas ça le type
                        'token': jwtUtils.generateToken(userFound, userCategory)
                    });
                }
                else {
                    return res.status(400).json({
                        'error': errBycrypt
                    });
                }
            });
        }
    }
    else{
        return res.status(404).end();
    }
    
});

// ajouter 1 catégorie à un utilisateur
router.post('/category', async (req, res) => {

    let user_has_category_id = req.body.categoryUserId;
    let userId = req.body.userId;
    UtilisateurController.addUser_has_category(user_has_category_id, userId).then(() => {
        res.status(200).end(); // status OK
    }).catch((err) => {
        console.log(err);
        res.status(409).end(); // Status conflict
    });
});



/***********************************************************************************/
/**                                   GET  REQUESTS                               **/
/***********************************************************************************/

router.get('/', async (req, res) => {

    //get user by id
    if (req.query.id) {
        const user = await UtilisateurController.getUserByID(req.query.id);
        if (user) {
            return res.json(user);
        }
        return res.status(408).end();

    }

    //get user by mail
    else if (req.query.mail !== undefined) {
        const user = await UtilisateurController.getUserByEmail(req.query.mail);
        if (user) {
            return res.json(user);
        }
        return res.status(408).end();
    }

    //get all users
    else {
        const users = await UtilisateurController.getAllUsers();
        if (users) {
            return res.json(users);
        }
        return res.status(408).end();
    }

});


//get category of a user
router.get('/category', async (req, res) => {
    const userId = req.query.userId;
    console.log("je rentre dans /category");
    let categoryId = await UtilisateurController.getUserCategory(userId);
    if (categoryId) {
        return res.json(categoryId);
    }
    return res.status(408).end();

});

//get all user by categories
router.get('/allByCategory', async (req, res) => {

    const type = req.query.type;

    const result = await UtilisateurController.getUsersByCategory(type);

    if (result) {
        return res.json(result);
    }
    return res.status(408).end();

});



//get all user by categories
router.get('/allValidByCategory', async (req, res) => {

    const type = req.query.type;

    const result = await UtilisateurController.getValidUsersByCategory(type);

    if (result) {
        return res.json(result);
    }
    return res.status(408).end();

});





/***********************************************************************************/
/**                                   PUT  REQUESTS                               **/
/***********************************************************************************/
router.put('/', async (req, res) => {
    const id = req.body.id;
    let libelle = req.body.libelle;
    let nom = req.body.nom;
    let prenom = req.body.prenom;
    let mail = req.body.mail;
    let tel = req.body.tel;
    let adresse = req.body.adresse;
    let ville = req.body.ville;
    let codePostal = req.body.codePostal;
    let pseudo = req.body.pseudo;
    let mdp = req.body.mdp;
    let photo = req.body.photo;
    let desc = req.body.desc;
    let tailleOrganisme = req.body.tailleOrganisme;
    let estValide = req.body.estValide;
    let siret = req.body.siret;
    let dateDeNaissance = req.body.dateDeNaissance;
    let nbPointsSourire = req.body.nbPointsSourire;

    const user = new Utilisateur(id, libelle, nom, prenom, mail, tel, adresse, ville,
        codePostal, pseudo, mdp, photo, desc, tailleOrganisme, estValide, siret, dateDeNaissance, nbPointsSourire);

    UtilisateurController.updateUser(user).then(() => {
        res.status(200).end(); // status OK
    }).catch((err) => {
        console.log(err);
        res.status(409).end(); // status conflict
    })

});


/***********************************************************************************/
/**                                   DELETE REQUESTS                             **/
/***********************************************************************************/
router.delete('/:id', async (req, res) => {
    console.log("route delete, params = " + req.params.id);
    if (req.params.id !== undefined) {
        console.log("route delete");
        let a = await UtilisateurController.deleteUser(req.params.id);
        if (a) {
            return res.status(200).end();
        }
        return res.status(408).end();
    }
    res.status(400).end();
});
module.exports = router;