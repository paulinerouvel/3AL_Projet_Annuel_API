const Database = require('../models/database');
const Produit = require('../models/produit_model');
const List = require('../models/liste_produit_model');
const manage_logs = require("../utils/manage_logs");

class ListController {

    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/

    async addList(newList) {
        try {
            const res = await Database.connection.execute('INSERT INTO `liste_produit` (`libelle`, `date`,' +
                ' `Utilisateur_id`, `estArchive`) VALUES (?, ?, ?, ?);',
                [newList.libelle, newList.date, newList.Utilisateur_id, newList.estArchive]);
            return res;


        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "list_controller.js", "addList");
            return 500;
        }
    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/

    async getListByID(id) {
        try{
            const results = await Database.connection.query('SELECT * FROM liste_produit WHERE liste_produit.id = ?', [id]);
            const rows = results[0];
            if (rows.length > 0) {
                return new List(rows[0].id, rows[0].libelle, rows[0].date, rows[0].Utilisateur_id, rows[0].estArchive);
            }
        }

        catch(err){
            console.log(err);
            manage_logs.generateLogs(err, "list_controller.js", "getListByID");
            return 500;
        }
        
    }

    // On récupère la liste des produits par catégorie d'utilisateur
    async getAllProductsByUserCategory(userCategoryID) {
        try {
            const res = await Database.connection.query('SELECT id, libelle, date, liste_produit.Utilisateur_id, estArchive FROM liste_produit JOIN `utilisateur_has_categorie` ON liste_produit.Utilisateur_id = utilisateur_has_categorie.Utilisateur_id WHERE utilisateur_has_categorie.Categorie_utilisateur_id = ?', [userCategoryID]);
            return res[0]
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "list_controller.js", "getAllProductsByUserCategory");
            return 500;
        }
        
    }

    // On récupère toutes les listes de produits d'un User
    async getAllListsByUser(user_ID) {
        try {
            const res = await Database.connection.query('SELECT * FROM `liste_produit` WHERE Utilisateur_id = ?', [user_ID]);
            return res[0];
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "list_controller.js", "getAllListsByUser");
            return 500;
        }
    }

    // On récupère tous les produits qui appartiennent à une liste
    async getAllProductsByList(listProduct_ID) {
        try {
            const res = await Database.connection.query('SELECT * FROM `produit` WHERE `Liste_Produit_id` = ?', [listProduct_ID]);

            return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "list_controller.js", "getAllProductsByList");
            return 500;
        }

    }

    // On récupère toutes les listes de produits
    async getAllLists() {
        try {
            const res = await Database.connection.query('SELECT * FROM `liste_produit`');
            //return results[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
            //    rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));
            return res[0];
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "list_controller.js", "getAllLists");
            return 500;
        }
    }


    /***********************************************************************************/
    /**                               UPDATE FUNCTIONS                                **/
    /***********************************************************************************/
    async updateList(list) {
        try {
            const res = await Database.connection.execute('UPDATE `liste_produit` SET libelle = ?, date = ?,' +
                ' Utilisateur_id = ?, estArchive = ? WHERE id = ?',
                [list.libelle, list.date, list.Utilisateur_id, list.estArchive, list.id]);
            return res;
        }
        catch (err){
            console.log(err);
            manage_logs.generateLogs(err, "list_controller.js", "updateList");
            return 500;
        }
    }


    /***********************************************************************************/
    /**                                 DELETE FUNCTIONS                              **/
    /***********************************************************************************/
    async deleteList(id) {
        try {
            const res = await Database.connection.execute('DELETE FROM liste_produit WHERE liste_produit.id = ?', [id]);
            return res;
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "list_controller.js", "deleteList");
            return 500;
        }
    }

}


module.exports = new ListController();