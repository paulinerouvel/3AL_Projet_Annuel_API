const Database = require('../models/database');
const Produit = require('../models/produit_model');


class ListController {


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/



    // On récupère toutes les listes de produits d'un User
    async getAllListsByUser(user_ID) {
        try {
            const res = await Database.connection.query('SELECT id, libelle FROM `liste_produit` WHERE Utilisateur_id = ?', [user_ID]);
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
            return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.quantite, rows.dlc, rows.codeBarre,
                rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.ListeDeProduit_id, rows.EntrepotWM_id));
        }
        catch (err) {
            console.log(err);
            return undefined;
        }

    }
}


module.exports = new ListController();