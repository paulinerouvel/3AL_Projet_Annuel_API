const Database = require('../models/database');
const Commande = require('../models/commande_model');
const Produit = require('../models/produit_model');

class CommandeController {


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/



    async addOrder(date, utilisateurID) {

        try {
            const res = await Database.connection.execute('INSERT INTO commande (date, utilisateur_id) VALUES (?, ?)', [date, utilisateurID]);
            return res;
        }
        catch (err) {
            console.log("Erreur lors de l'enregistrement : " + err);
            throw err;
        }


    }



    async addProductInOrder(commande_has_produit) {
        try {
            const res = await Database.connection.execute('INSERT INTO commande_has_produit (Produit_id,  Commande_id, quantite) VALUES (?, ?, ?)',
                [commande_has_produit.produit_id, commande_has_produit.commande_id, commande_has_produit.quantite]);

            return res;
        }
        catch (err) {
            console.log("Erreur lors de l'enregistrement : " + err);
            throw err;

        }


    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/


    async getOrderByID(id) {

        try {
            const results = await Database.connection.query('SELECT * FROM commande WHERE commande.id = ?', [id]);
            const rows = results[0];
            if (rows.length > 0) {
                return new Commande(rows[0].id, rows[0].date, rows[0].Utilisateur_id);
            }
            return [];
        }
        catch (err) {
            console.log(err);
            throw err;
        }

    }

    async getOrderByIdUser(id) {

        try {
            const results = await Database.connection.query('SELECT * FROM commande WHERE commande.Utilisateur_id = ?', [id]);

            return results[0].map((rows) => new Commande(rows.id, rows.date, rows.Utilisateur_id));
        }
        catch (err) {
            return err;
        }

    }




    async getAllOrders() {
        try {
            const res = await Database.connection.query('SELECT * FROM `commande`');
            if (res.length > 0) {
                return res[0].map((rows) => new Commande(rows.id, rows.date, rows.Utilisateur_id));
            }
            else {
                return [];
            }

        }
        catch (err) {
            console.log(err);
            return undefined;
        }

    }

    async getAllProductsInOrder(order_id) {
        try {
            //SELECT produit.id, produit.libelle, produit.desc, produit.photo, produit.prix, produit.prixInitial, produit.quantite, produit.DLC, produit.codeBarre, produit.enRayon, produit.dateMiseEnRayon, produit.CategorieProduit_id, produit.Liste_Produit_id, produit.Entrepot_id, produit.destinataire, 
            const res = await Database.connection.query('SELECT produit.id, produit.libelle, produit.desc, produit.photo, produit.prix, produit.prixInitial,  produit.DLC, produit.codeBarre, produit.enRayon, produit.dateMiseEnRayon, produit.CategorieProduit_id, produit.Liste_Produit_id, produit.Entrepot_id, produit.destinataire,  commande_has_produit.quantite FROM `produit`, `commande_has_produit` WHERE Commande_id = ? AND Produit_id = produit.id', [order_id]);

            console.log(res[0])
            if (res.length > 0) {
                return res[0]/*.map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                    rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));*/

            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }

    }



    async getSumOfProductsOrderByUserAndDate(dateDebut, dateFin, idUser) {
        try {

            //SELECT * FROM `commande` WHERE DATEDIFF(date,'2019-07-01') >=0 => superieur à 2019...
            const res = await Database.connection.query('SELECT  SUM(chp.quantite) as total FROM `commande_has_produit` as chp, `commande` WHERE commande.id = chp.Commande_id AND commande.Utilisateur_id = ? AND DATEDIFF(date, ? ) >= 0 AND DATEDIFF(date, ? ) <= 0 ',
                [idUser, dateDebut, dateFin]);

            if (res.length > 0) {
                return res[0];
            }
            return [];
        }
        catch (err) {
            throw err;
        }

    }

    /***********************************************************************************/
    /**                               UPDATE  FUNCTIONS                               **/
    /***********************************************************************************/

    // A TESTER / A CORRIGER
    /*async updateQuantityCommande_has_produit(commande_id, produit_id, quantite) {
        try {
            const res = await Database.connection.execute('UPDATE `commande_has_produit` SET quantity = ? WHERE Produit_id = ? AND Commande_id = ?',
                [quantite, produit_id, commande_id]);
            return res;
        }
        catch {
            return undefined;
        }
    }*/




    /***********************************************************************************/
    /**                                DELETE FUNCTIONS                               **/
    /***********************************************************************************/
    async deleteOrder(id) {
        try {

            const res = await Database.connection.execute('DELETE FROM commande WHERE commande.id = ?', [id]);
            await this.deleteProductInOrder(id);
            return res;
        }
        catch (err) {
            console.log("Erreur lors de la suppression: " + err);
            throw err;
        }
    }

    async deleteProductInOrder(id) {
        try {

            const res = await Database.connection.execute('DELETE FROM commande_has_produit WHERE Commande_id = ?', [id]);
            return res;
        }
        catch (err) {
            console.log("Erreur lors de la suppression: " + err);
            throw err;
        }
    }
}

module.exports = new CommandeController();