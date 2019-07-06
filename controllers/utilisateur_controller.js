const Database = require('../models/database');
const Utilisateur = require('../models/utilisateur_model');
class UtilisateurController {
    


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/

    // async partnerApply(newUser) {

    //     // crée une demande d'inscription 
    //     // A RETESTER
    //     try {
    //         const res = await Database.connection.execute('INSERT INTO `demande_inscription` (`libelle`, `adresse`, `ville`,' +
    //             '`codePostal`, `pseudo`, `mdp`, presentation, mail, tel, `siret`, type, `utilisateur_id`) ' +
    //             'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
    //             [newUser.libelle, newUser.adresse, newUser.ville, newUser.codePostal, newUser.pseudo, newUser.mdp,
    //             newUser.presentation, newUser.mail, newUser.tel, newUser.siret, newUser.type, newUser.utilisateur_id]);
    //         return res;


    //     }
    //     catch {
    //         return undefined;
    //     }
    // }

    async addUser(newUser) {
        try {
            const res = await Database.connection.execute('INSERT INTO `utilisateur` (`libelle`, `nom`, `prenom`, `mail`, `tel`, `adresse`, `ville`,' +
                '`codePostal`, `pseudo`, `mdp`, `photo`, `desc`, `tailleOrganisme`, `estValide`, `siret`, `dateDeNaissance`, `nbPointsSourire`) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [newUser.libelle, newUser.nom, newUser.prenom, newUser.mail, newUser.tel, newUser.adresse, newUser.ville, newUser.codePostal, newUser.pseudo,
                newUser.mdp, newUser.photo, newUser.desc, newUser.tailleOrganisme, newUser.estValide, newUser.siret, newUser.dateDeNaissance, newUser.nbPointsSourire]);
            return res;


        }
        catch (err) {
            console.log("Erreur lors de l'enregistrement de l'utilisateur : " + err);
            throw err;
        }
    }

    async addUser_has_category(user_has_category_id, user_id) {
        try {
            const res = await Database.connection.execute('INSERT INTO utilisateur_has_categorie (Categorie_utilisateur_id, Utilisateur_id) VALUES (?, ?)', [user_has_category_id, user_id]);
            return res;
        }
        catch {
            return undefined;
        }
    }



    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/
    
    async getUserByID(id) {
        // on select un utilisateur avec son prenom
        const results = await Database.connection.query('SELECT * FROM utilisateur WHERE utilisateur.id = ?', [id]);
        const rows = results[0];
        if (rows.length > 0) {
            return new Utilisateur(rows[0].id, rows[0].libelle, rows[0].nom, rows[0].prenom, rows[0].mail, rows[0].tel, rows[0].adresse, rows[0].ville,
                rows[0].codePostal, rows[0].pseudo, rows[0].mdp, rows[0].photo, rows[0].desc, rows[0].tailleOrganisme, rows[0].estValide,
                rows[0].siret, rows[0].dateDeNaissance, rows[0].nbPointsSourire);
        }
        return undefined;
    }

    async getUserByEmail(email) {
        // on select un utilisateur avec son prenom
        const results = await Database.connection.query('SELECT * FROM utilisateur WHERE utilisateur.mail = ?', [email]);
        const rows = results[0];
        if (rows.length > 0) {
            return new Utilisateur(rows[0].id, rows[0].libelle, rows[0].nom, rows[0].prenom, rows[0].mail, rows[0].tel, rows[0].adresse, rows[0].ville,
                rows[0].codePostal, rows[0].pseudo, rows[0].mdp, rows[0].photo, rows[0].desc, rows[0].tailleOrganisme, rows[0].estValide,
                rows[0].siret, rows[0].dateDeNaissance, rows[0].nbPointsSourire);
        }
        return undefined;
    }


    async getAllUsers() {
        try {
            const res = await Database.connection.query('SELECT * FROM `utilisateur`');
            return res[0].map((rows) => new Utilisateur(rows.id, rows.libelle, rows.nom, rows.prenom, rows.mail, rows.tel,
                rows.adresse, rows.ville, rows.codePostal, rows.pseudo, rows.mdp, rows.photo,
                rows.desc, rows.tailleOrganisme, rows.estValide, rows.siret, rows.dateDeNaissance, rows.nbPointsSourire)
            );
        }
        catch (err) {
            console.log(err);
            return undefined;
        }

    }

    //Get le type d\'un user
    async getUserCategory(userID) {
        const res = await Database.connection.query('SELECT Categorie_utilisateur_id FROM utilisateur_has_categorie WHERE utilisateur_id = ?', [userID]);
        const rows = res[0];
        if (rows.length > 0) {
            console.log("test :", rows[0].Categorie_utilisateur_id);
            return rows[0].Categorie_utilisateur_id;
        }
    }


    //Get tout les users par type
    async getUsersByCategory(category) {

        /*;*/
        const res = await Database.connection.query('SELECT * FROM `utilisateur`, `categorie_utilisateur`, `utilisateur_has_categorie` WHERE categorie_utilisateur.libelle = ? AND utilisateur_has_categorie.Categorie_utilisateur_id = categorie_utilisateur.id AND utilisateur_has_categorie.Utilisateur_id = utilisateur.id', [category]);
        const rows = res[0];

        console.log(rows)
        if (rows.length > 0) {
            return res[0];
            // return res[0].map((rows) => rows.libelle, rows.id, rows.Libelle, rows.nom, rows.prenom, rows.mail, rows.tel, 
            //     rows.adresse, rows.ville, rows.codePostal, rows.pseudo, rows.mdp, rows.photo, 
            //     rows.desc, rows.tailleOrganisme, rows.estValide, rows.siret, rows.dateDeNaissance, rows.nbPointsSourire)
            //     ;
        }
    }



    /***********************************************************************************/
    /**                               UPDATE FUNCTIONS                                **/
    /***********************************************************************************/
    async updateUser(user) {
        try {
            const res = await Database.connection.execute('UPDATE `utilisateur` SET libelle = ?, nom = ?, prenom = ?, mail = ?, tel = ?, adresse = ?, ville = ?,' +
                'codePostal = ?, pseudo = ?, mdp = ?, photo = ?, utilisateur.desc = ?, tailleOrganisme = ?, estValide = ?, siret = ?, dateDeNaissance = ?, nbPointsSourire = ? ' +
                'WHERE id = ?',
                [user.libelle, user.nom, user.prenom, user.mail, user.tel, user.adresse, user.ville, user.codePostal, user.pseudo, user.mdp, user.photo,
                user.desc, user.tailleOrganisme, user.estValide, user.siret, user.dateDeNaissance, user.nbPointsSourire, user.id]);
            return res;
        }
        catch {
            return undefined;
        }
    }



    /***********************************************************************************/
    /**                                DELETE FUNCTIONS                               **/
    /***********************************************************************************/

    async deleteUser(id) {
        try {

            const res = await Database.connection.execute('DELETE FROM utilisateur WHERE utilisateur.id = ?', [id]);


            return res;
        }
        catch (err) {
            console.log("error delete tavu : " + err);
            return undefined;
        }
    }
}

module.exports = new UtilisateurController();