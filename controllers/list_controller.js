const Database = require('../models/database');
const Produit = require('../models/produit_model');


class ListController {


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/

    // On récupère la liste des produits par catégorie d'utilisateur
    async getAllProductsByUserCategory(userCategoryID) {
        try {
            const res = await Database.connection.query('SELECT id, libelle, date, liste_produit.Utilisateur_id, estArchive FROM liste_produit JOIN `utilisateur_has_categorie` ON liste_produit.Utilisateur_id = utilisateur_has_categorie.Utilisateur_id WHERE utilisateur_has_categorie.Categorie_utilisateur_id = ?', [userCategoryID]);
            return res[0]
        }
        catch (err) {
            console.log(err);
            return undefined;
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
            return undefined;
        }
    }

    // On récupère tous les produits qui appartiennent à une liste
    async getAllProductsByList(listProduct_ID) {
        try {
            const res = await Database.connection.query('SELECT * FROM `produit` WHERE `Liste_Produit_id` = ?', [listProduct_ID]);
            console.log(res[0]);
            return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));
        }
        catch (err) {
            console.log(err);
            return undefined;
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
            return undefined;
        }
    }
}


module.exports = new ListController();