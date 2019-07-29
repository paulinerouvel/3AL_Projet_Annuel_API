'use strict';

const Database = require('../models/database');
const Produit = require('../models/produit_model');
const CategorieProduit = require('../models/categorieproduit_model');

class ProduitController {


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/

    async addProduct(newProduct) {

        try {
            const res = await Database.connection.execute('INSERT INTO `produit` (`libelle`, `desc`, `photo`, `prix`, `prixInitial`, `quantite`, `DLC`,' +
                '`codeBarre`, `enRayon`, `dateMiseEnRayon`, `CategorieProduit_id`, `Liste_Produit_id`, `Entrepot_id`, `destinataire`) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [newProduct.libelle, newProduct.desc, newProduct.photo, newProduct.prix, newProduct.prixInitial, newProduct.quantite, newProduct.dlc, newProduct.codeBarre, newProduct.enRayon,
                    newProduct.dateMiseEnRayon, newProduct.categorieProduit_id, newProduct.listProduct_id, newProduct.entrepotwm_id, newProduct.destinataire]);
            return res;


        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }


    async addProductCategory(libelle) {
        try{
            return await Database.connection.execute('INSERT INTO categorie_produit (libelle) VALUES (?)', [libelle]);
        }
        catch(err){
            console.log(500);
            return 500;
        }
        
    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/

    async getProductByID(id) {
        // on select un produit avec son id
        try{
            const results = await Database.connection.query('SELECT * FROM produit WHERE produit.id = ?', [id]);
            const rows = results[0];
            if (rows.length > 0) {
                return new Produit(rows[0].id, rows[0].libelle, rows[0].desc, rows[0].photo, rows[0].prix, rows[0].prixInitial, rows[0].quantite, rows[0].DLC, rows[0].codeBarre,
                    rows[0].enRayon, rows[0].dateMiseEnRayon, rows[0].CategorieProduit_id, rows[0].Liste_Produit_id, rows[0].Entrepot_id, rows[0].destinataire);
            }
        }

        catch(err){
            console.log(err);
            return 500;
        }
        
    }

    async getAllProductsEnRayon() {
        // on select les produits en rayon chez wastemart
        try {
            const results = await Database.connection.query('SELECT * FROM produit WHERE produit.enRayon = true');
            return results[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));
        }
        catch (err) {
            console.log(err);
            return 500;
        }

    }

    async getAllProductsEnRayonByDest(dest) {
        // on select les produits en rayon chez wastemart
        try {
            const results = await Database.connection.query('SELECT * FROM produit WHERE produit.enRayon = 1 AND destinataire = ? AND quantite > 0', [dest]);

            if (results[0].length > 0) {
                return results[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                    rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));

            }
            return [];
        }
        catch (err) {
            console.log(err);
            return 500;
        }

    }


    // On récupère tous les produits qui sont dans un entrepot
    async getAllProductsByWarehouse(warehouse_ID) {
        try {
            const res = await Database.connection.query('SELECT * FROM `produit` WHERE Entrepot_id = ?', [warehouse_ID]);
            return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));
        }
        catch (err) {
            console.log(err);
            return 500;
        }

    }

    // On récupère tous les produits d'une liste qui sont dans un entrepot
    async getAllProductsOfAListByWarehouse(warehouse_ID, listProduct_ID) {
        try {
            const res = await Database.connection.query('SELECT * FROM `produit` WHERE Entrepot_id = ? AND Liste_Produit_id = ?', [warehouse_ID, listProduct_ID]);
            return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));
        }
        catch (err) {
            console.log(err);
            return 500;
        }

    }

    // faut faire un getbydatemiseenrayon aussi

    async getProductOfAnOrder(commandID) {
        try {
            const res = await Database.connection.query('SELECT produit.* FROM produit JOIN commande_has_produit ON produit.id = commande_has_produit.Produit_id WHERE commande_has_produit.Commande_id = ?', [commandID]);
            return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));
        }
        catch (err) {
            console.log(err);
            return 500;
        }

    }

    async getProductCategoryByID(id) {
        try {
            const results = await Database.connection.query('SELECT * FROM categorie_produit WHERE categorie_produit.id = ?', [id]);
            const rows = results[0];
            if (rows.length > 0) {
                return new CategorieProduit(rows[0].id, rows[0].libelle);
            }
        }
        catch(err){
            console.log(err);
            return 500;
        }

    }

    async getAllProductCategories() {
        try {
            const res = await Database.connection.query('SELECT * FROM `categorie_produit`');
            return res[0].map((rows) => new CategorieProduit(rows.id, rows.libelle));
        }
        catch (err) {
            console.log(err);
            return 500;
        }

    }

    async getAllProductsByUserCategory(userCategoryID) {
        try {
            const res = await Database.connection.query('SELECT * FROM liste_produit JOIN `utilisateur_has_categorie` ON liste_produit.Utilisateur_id = utilisateur_has_categorie.Utilisateur_id WHERE utilisateur_has_categorie.Categorie_utilisateur_id = 1');
            return res[0].map((rows) => new CategorieProduit(rows[0].id, rows[0].libelle));
        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }

    async getProductByCategorieAndDest(idCategorie, dest) {
        try {
            const res = await Database.connection.query('SELECT * FROM `produit` WHERE CategorieProduit_id = ? AND destinataire = ? AND enRayon = 1 AND quantite > 0', [idCategorie, dest]);
            if (res.length > 0) {
                return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                    rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));

            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }


    async getProductByNameAndDest(name, dest) {
        try {
            const res = await Database.connection.query('SELECT * FROM `produit` WHERE (`libelle` LIKE ? OR `desc` LIKE ? ) AND destinataire = ? AND enRayon = 1 AND quantite > 0', ['%' + name + '%', '%' + name + '%', dest]);
            if (res.length > 0) {
                return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                    rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));

            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }

    async getProductByName(name) {
        try {
            const res = await Database.connection.query('SELECT * FROM `produit` WHERE (`libelle` LIKE ? OR `desc` LIKE ? ) AND enRayon = 1 AND quantite > 0', ['%' + name + '%', '%' + name + '%']);
            if (res.length > 0) {
                return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                    rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));

            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }

    async getProductByPrixAndDest(prixMin, prixMax, dest) {
        try {
            const res = await Database.connection.query('SELECT * FROM `produit` WHERE `prix` >= ? AND `prix` <= ? AND `destinataire`= ? AND enRayon = 1 AND quantite > 0', [prixMin, prixMax, dest]);
            if (res.length > 0) {
                return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.prixInitial, rows.quantite, rows.DLC, rows.codeBarre,
                    rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.Liste_Produit_id, rows.Entrepot_id, rows.destinataire));

            }
            else {
                return [];
            }
        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }

    /***********************************************************************************/
    /**                                UPDATE FUNCTIONS                               **/
    /***********************************************************************************/
    async updateProduct(product) {
        console.log(product)
        try {

            const res = await Database.connection.execute('UPDATE `produit` SET `libelle` = ?, `desc` = ?, photo = ?, prix = ?, prixInitial = ?, quantite = ?, DLC = ?, codeBarre = ?, enRayon = ?, dateMiseEnRayon = ?,CategorieProduit_id = ?, Liste_Produit_id = ?, Entrepot_id = ?, destinataire = ? WHERE id = ?',
                [product.libelle, product.desc, product.photo, product.prix, product.prixInitial, product.quantite,
                product.dlc, product.codeBarre, product.enRayon, product.dateMiseEnRayon,
                product.categorieProduit_id, product.listProduct_id, product.entrepotwm_id, product.destinataire,
                    product.id]);
            return res;
        }
        catch(err) {
            console.log(err)
            return 500;
        }
    }

    async updateProductCategory(categoryProduct) {
        try {
            const res = await Database.connection.execute('UPDATE `categorie_produit` SET libelle = ?' +
                'WHERE id = ?',
                [categoryProduct.libelle, categoryProduct.id]);
            return res;
        }
        catch {
            console.log(err)
            return 500;
        }
    }


    async updateProductWarehouse(idProduct, idWarehouse) {
        try {
            const res = await Database.connection.execute('UPDATE `produit` SET Entrepot_id = ? WHERE id = ?',
                [idWarehouse, idProduct]);
            return res;
        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }





    /***********************************************************************************/
    /**                                 DELETE FUNCTIONS                              **/
    /***********************************************************************************/
    async deleteProduct(id) {
        try {
            const res = await Database.connection.execute('DELETE FROM produit WHERE produit.id = ?', [id]);
            return res;
        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }

}
module.exports = new ProduitController();