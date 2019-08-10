const Database = require('../models/database');
const Commande = require('../models/commande_model');
const Produit = require('../models/produit_model');

class CommandeController {


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/


    async addOrder(date, utilisateurID, adresse_livraison, cp_livraison, ville_livraison) {

        try {
            const res = await Database.connection.execute('INSERT INTO `commande` (`date`, `adresse_livraison`, `cp_livraison`, `ville_livraison` , `Utilisateur_id`) VALUES (?, ?, ?, ?, ?)', [date, adresse_livraison, cp_livraison, ville_livraison, utilisateurID]);
            return res;
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "addOrder");
            return 500;
        }


    }



    async addProductInOrder(commande_has_produit) {
        try {
            const res = await Database.connection.execute('INSERT INTO commande_has_produit (Produit_id,  Commande_id, quantite) VALUES (?, ?, ?)',
                [commande_has_produit.produit_id, commande_has_produit.commande_id, commande_has_produit.quantite]);

            return res;
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "addProductInOrder");
            return 500;

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
                
                return new Commande(rows[0].id, rows[0].date, rows[0].adresse_livraison, rows[0].cp_livraison, rows[0].ville_livraison,  rows[0].Utilisateur_id);
            }
            return [];
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getOrderByID");
            return 500;
        }

    }

    async getOrderByIdUser(id) {
        

        try {
            const results = await Database.connection.query('SELECT * FROM commande WHERE commande.Utilisateur_id = ?', [id]);

            return results[0].map((rows) => new Commande(rows.id, rows.date, rows.adresse_livraison, rows.cp_livraison, rows.ville_livraison,  rows.Utilisateur_id));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getOrderByIdUser");
            return 500;
        }

    }


    async getLastOrderByIdUser(id) {
        try {
            const results = await Database.connection.query('select * FROM commande c WHERE c.date = (select max(date) FROM commande WHERE Utilisateur_id = ?)', [id]);

            return results[0].map((rows) => new Commande(rows.id, rows.date, rows.adresse_livraison,rows.cp_livraison,  rows.ville_livraison , rows.Utilisateur_id));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getLastOrderByIdUser");
            return 500;
        }

    }
    




    async getAllOrders() {
        try {
            const res = await Database.connection.query('SELECT * FROM `commande`');
            if (res.length > 0) {

                return res[0].map((rows) => new Commande(rows.id, rows.date, rows.adresse_livraison, rows.cp_livraison, rows.ville_livraison, rows.Utilisateur_id));
            }
            else {
                return [];
            }

        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getAllOrders");
            return 500;
        }

    }

    async getAllProductsInOrder(order_id) {
        try {
            const res = await Database.connection.query('SELECT produit.id, produit.libelle, produit.desc, produit.photo, produit.prix, produit.prixInitial,  produit.DLC, produit.codeBarre, produit.enRayon, produit.dateMiseEnRayon, produit.CategorieProduit_id, produit.Liste_Produit_id, produit.Entrepot_id, produit.destinataire,  commande_has_produit.quantite FROM `produit`, `commande_has_produit` WHERE Commande_id = ? AND Produit_id = produit.id', [order_id]);

            return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));


        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getAllProductsInOrder");
            return 500;
        }

    }



    async getSumOfProductsOrderByUserAndDate(dateDebut, dateFin, idUser) {
        try {

            //SELECT * FROM `commande` WHERE DATEDIFF(date,'2019-07-01') >=0 => superieur à 2019...
            let res = await Database.connection.query('SELECT  SUM(chp.quantite) as total FROM `commande_has_produit` as chp, `commande` WHERE commande.id = chp.Commande_id AND commande.Utilisateur_id = ? AND DATEDIFF(date, ? ) >= 0 AND DATEDIFF(date, ? ) <= 0 ',
                [idUser, dateDebut, dateFin]);


            if(res[0].total == null){
                return 0;
            }

            return res[0];

        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "getSumOfProductsOrderByUserAndDate");
            return 500;
        }

    }


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
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "deleteOrder");
            return 500;
        }
    }

    async deleteProductInOrder(id) {
        try {

            const res = await Database.connection.execute('DELETE FROM commande_has_produit WHERE Commande_id = ?', [id]);
            return res;
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "commande_controller.js", "deleteProductInOrder");
            return 500;
        }
    }
}

module.exports = new CommandeController();