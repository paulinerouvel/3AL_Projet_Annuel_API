'use strict';

const jwtUtils = require('../utils/jwt.utils')
const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('../utils/jwt.utils').verifyToken;
const bodyParser = require('body-parser');
const UtilisateurController = require('../controllers/utilisateur_controller');
const Utilisateur = require('../models/utilisateur_model');
const MailController = require('../controllers').mailController;

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
    let photo = req.body.photo;
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
        manage_logs.generateLogs(err, "utilisateur_route.js", "post /register");
        res.status(409).end(); // status conflict
    }


    if (mail && tel  && adresse && ville && codePostal && pseudo && mdp && estValide != undefined) {

        if(photo == undefined){
            photo="img_profil.png";
        }

        const userExist = await UtilisateurController.getUserByEmail(mail);

        if(userExist != 500 && userExist == []){
            const user = new Utilisateur(-1, libelle, nom, prenom, mail, tel, adresse, ville,
                codePostal, pseudo, mdp, photo, desc, tailleOrganisme, estValide, siret, dateDeNaissance, nbPointsSourire);
    
    
            let result = await UtilisateurController.addUser(user);
    
            if (result != 500) {
                res.status(201).end();
            }
            else {
                return res.status(500).end();
            }
        }
        else{
            return res.status(401).json({
                'Result': "Email already exist"
            });
        }

        
    }
    else {
        return res.status(400).end();
    }
});



//login
router.post('/login', async (req, res) => {

    let mail = req.body.mail;
    let mot_de_passe = req.body.mdp;

    if (mail != undefined && mot_de_passe != undefined) {

        let userFound = await UtilisateurController.getUserByEmail(mail);

        if (userFound != undefined && userFound.estValide == 1) {

            let userCategory = await UtilisateurController.getUserCategory(userFound.id);

            if(userCategory == 500){
                return res.status(500).end();
            }

            bcrypt.compare(mot_de_passe, userFound.mdp, function (errBycrypt, resBycrypt) {
                if (resBycrypt) {
                    return res.status(200).json({
                        'userId': userFound.id,
                        'userCategory': userCategory,
                        // 'typeUtil': userFound.status, 
                        'token': jwtUtils.generateToken(userFound, userCategory)
                    });
                }
                else {
                    return res.status(401).json({
                        'Result': "Wrong password"
                    });
                }
            });
        }
        else{
            return res.status(401).json({"Result": "No user found"});
        }
    }
    else {
        return res.status(400).end();
    }

});

// ajouter 1 catégorie à un utilisateur
router.post('/category', async (req, res) => {

    let categoryUserId = req.body.categoryUserId;
    let userId = req.body.userId;

    if (categoryUserId && userId) {
        let result = await UtilisateurController.addUser_has_category(categoryUserId, userId);
        if (result != 500) {
            return res.status(201).end();

        }
        return res.status(500).end();

    }
    return res.status(400).end();


});



/***********************************************************************************/
/**                                   GET  REQUESTS                               **/
/***********************************************************************************/

router.get('/', async (req, res) => {

    //get user by id
    if (req.query.id) {
        const user = await UtilisateurController.getUserByID(req.query.id);
        if (user != 500) {
            return res.json(user);
        }
        return res.status(500).end();

    }

    //get user by mail
    else if (req.query.mail !== undefined) {
        const user = await UtilisateurController.getUserByEmail(req.query.mail);
        if (user != 500) {
            return res.json(user);
        }
        return res.status(500).end();
    }

    //get all users
    else {
        const users = await UtilisateurController.getAllUsers();
        if (users != 500) {
            return res.json(users);
        }
        return res.status(500).end();
    }

});


//get category of a user
router.get('/category', async (req, res) => {
    const userId = req.query.userId;

    if (userId) {
        let categoryId = await UtilisateurController.getUserCategory(userId);
        if (categoryId != 500) {
            return res.json(categoryId);
        }
        return res.status(500).end();
    }
    return res.status(400).end();


});

//get all user by categories
router.get('/allByCategory', async (req, res) => {

    const type = req.query.type;

    if (type) {

        const result = await UtilisateurController.getUsersByCategory(type);

        if (result != 500) {
            return res.json(result);
        }
        return res.status(500).end();
    }
    else {
        return res.status(400).end();
    }


});






//get all user by categories
router.get('/allValidByCategory', async (req, res) => {

    const type = req.query.type;

    if (type) {
        const result = await UtilisateurController.getValidUsersByCategory(type);

        if (result != 500) {
            return res.json(result);
        }
        return res.status(500).end();
    }

    return res.status(400).end();


});




router.get('/categories', async (req, res) => {


    const result = await UtilisateurController.getAllCategoriesExceptAdmin();

    if (result != 500) {
        return res.json(result);
    }
    return res.status(500).end();

});



/***********************************************************************************/
/**                                   PUT  REQUESTS                               **/
/***********************************************************************************/
router.put('/', verifyToken, async (req, res) => {
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

    if (id && mail && tel  && adresse && ville && codePostal && pseudo && mdp && estValide != undefined) {


        let curUser = await UtilisateurController.getUserByID(id);

        if (curUser.mdp != mdp) {
            let cryptedPass = await bcrypt.hashSync(mdp, 5);
            try {
                mdp = cryptedPass;

                if(curUser.estValide != estValide){

                    let message = "";

                    if(estValide == true){
                        message = "<!DOCTYPE html>"+
                        "<html>"+
                            "<t/><h3>Bonjour, </h3><br/>"+
                            "<h4>Après vérification de votre compte par les agents WasteMart, celui-ci à été validé ! <br/>"+
                            "Vous pouvez désormais vous rendre sur <a href='#'>WasteMart</a> et vous connecter avec vos identifiants."+
                            
                            "<br/><br/>"+
                            "Nous espérons vous voir rapidement sur notre site !"+
                            "<br/><br/>"+
                            "L'équipe WasteMart. "+
                            "</h4>"+
                            
                            
                        "</html>";
                    }
                    else{
                        message = "<!DOCTYPE html>"+
                        "<html>"+
                            "<t/><h3>Bonjour, </h3><br/>"+
                            "<h4> Votre compte WasteMart à été bloqué par les administateur de l'application.<br/>"+
                            "Si vous souhaitez plus d'information au sujet du bannissement de votre compte, veuillez contacter "+
                            "l'adresse mail qui suit : <a>wastemart.company@gmail.com </a>"
                            "<br/><br/>"+
                            "Cordialement, "+
                            "<br/><br/>"+
                            "L'équipe WasteMart. "+
                            "</h4>"+
                            
                            
                        "</html>";
                    }
        


                    await MailController.sendMail("wastemart.company@gmail.com", curUser.mail, "Votre compte à changé de statut !", message);

                }
            }
            catch (err) {
                console.log(err);
                manage_logs.generateLogs(err, "utilisateur_route.js", "put");
                res.status(409).end(); // status conflict
            }
        }



        const user = new Utilisateur(id, libelle, nom, prenom, mail, tel, adresse, ville,
            codePostal, pseudo, mdp, photo, desc, tailleOrganisme, estValide, siret, dateDeNaissance, nbPointsSourire);

        let result = await UtilisateurController.updateUser(user);

        if (result != 500) {
            return res.status(200).end();
        }
        else {
            return res.status(500).end();
        }


    }

    return res.status(400).end();

});


/***********************************************************************************/
/**                                   DELETE REQUESTS                             **/
/***********************************************************************************/
router.delete('/:id', verifyToken, async (req, res) => {

    if (req.params.id) {
        let a = await UtilisateurController.deleteUser(req.params.id);
        if (a != 500) {
            return res.status(200).end();
        }
        return res.status(500).end();
    }
    return res.status(400).end();
});
module.exports = router;