'use strict';

// const models = require('../models');
// const Produit = models.Produit;
const Database = require('../models/database');
const Produit = require('../models/produit_model');
const CategorieProduit = require('../models/categorieproduit_model');

class ProduitController {
    
    addProduct(libelle, desc, photo, prix, reduction, dlc, codeBarre, enRayon, dateMiseEnRayon, categorieProduit_id, listProduct_id, entrepotwm_id) {

        return Database.connection.execute('INSERT INTO `produit` (`libelle`, `desc`, `photo`, `prix`, `reduction`, `DLC`,'+
        '`codeBarre`, `enRayon`, `dateMiseEnRayon`, `CategorieProduit_id`, `Liste de Produit_id`, `EntrepotWM_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);',
        [libelle, desc, photo, prix, reduction, dlc, codeBarre, enRayon, dateMiseEnRayon, categorieProduit_id, listProduct_id, entrepotwm_id]);
    
    }


    addProductCategory(libelle) {
        return Database.connection.execute('INSERT INTO categorieproduit (libelle) VALUES (?)', [libelle]);
    }


 //*******************************************         GET FUNCTIONS        ***************************************************************************************


 async getProductByID(id) {
    // on select un produit avec son id
    const results =  await Database.connection.query('SELECT * FROM produit WHERE produit.id = ?', [id]);
    const rows = results[0];
    if (rows.length > 0) {
        return new Produit(rows[0].id, rows[0].libelle, rows[0].desc, rows[0].photo, rows[0].prix, rows[0].reduction, rows[0].dlc, rows[0].codeBarre, 
            rows[0].enRayon, rows[0].dateMiseEnRayon, rows[0].CategorieProduit_id, rows[0].ListeDeProduit_id, rows[0].EntrepotWM_id);
    }
    return undefined;
}

async getAllProductsEnRayon() {
    // on select les produits en rayon chez wastemart
    try
    {
    const results =  await Database.connection.query('SELECT * FROM produit WHERE produit.enRayon = true');
        return results[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.reduction, rows.dlc, rows.codeBarre, 
            rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.ListeDeProduit_id, rows.EntrepotWM_id));
    }
    catch(err) {
        console.log(err);
        return undefined;
    }
    
}


// On récupère tous les produits qui appartiennent à une liste
async getAllProductsByList(listProduct_ID){
    try
    {
        const res = await Database.connection.query('SELECT * FROM `produit` WHERE Liste de Produit_id = ?', [listProduct_ID]);
        return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.reduction, rows.dlc, rows.codeBarre, 
            rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.ListeDeProduit_id, rows.EntrepotWM_id));
    }
    catch(err) {
        console.log(err);
        return undefined;
    }
    
}

// On récupère tous les produits qui sont dans un entrepot
async getAllProductsByWarehouse(warehouse_ID){
    try
    {
        const res = await Database.connection.query('SELECT * FROM `produit` WHERE EntrepotWM_id = ?', [warehouse_ID]);
        return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.reduction, rows.dlc, rows.codeBarre, 
            rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.ListeDeProduit_id, rows.EntrepotWM_id));
    }
    catch(err) {
        console.log(err);
        return undefined;
    }
    
}

// On récupère tous les produits d'une liste qui sont dans un entrepot ...... Pas sûr que ce soit nécessaire...
async getAllProductsOfAListByWarehouse(warehouse_ID, listProduct_ID){
    try
    {
        const res = await Database.connection.query('SELECT * FROM `produit` WHERE EntrepotWM_id = ? AND Liste de Produit_id = ?', [warehouse_ID, listProduct_ID]);
        return res[0].map((rows) => new Produit(rows.id, rows.libelle, rows.desc, rows.photo, rows.prix, rows.reduction, rows.dlc, rows.codeBarre, 
            rows.enRayon, rows.dateMiseEnRayon, rows.CategorieProduit_id, rows.ListeDeProduit_id, rows.EntrepotWM_id));
    }
    catch(err) {
        console.log(err);
        return undefined;
    }
    
}

// faut faire un getbydatemiseenrayon aussi


//*******************************************        GET PRODUCT_CATEGORY        ***************************************************************************************

async getProductCategoryByID(id) {
    // on select un utilisateur avec son prenom
    const results =  await Database.connection.query('SELECT * FROM categorieproduit WHERE categorieproduit.id = ?', [id]);
    const rows = results[0];
    if (rows.length > 0) {
        return new CategorieProduit(rows[0].id, rows[0].libelle);
    }
    return undefined;
}

async getAllProductCategories(){
    try
    {
        const res = await Database.connection.query('SELECT * FROM `categorieproduit`');
        return res[0].map((rows) => new CategorieProduit(rows[0].id, rows[0].libelle));
    }
    catch(err) {
        console.log(err);
        return undefined;
    }
    
}

//*******************************************         UPDATE FUNCTIONS        ***************************************************************************************

async updateProduct(product) {
    try {
        const res = await Database.connection.execute('UPDATE `produit` SET libelle = ?, desc = ?, photo = ?, prix = ?, reduction = ?, dlc = ?, codeBarre = ?,'+
        'enRayon = ?, dateMiseEnRayon = ?, CategorieProduit_id = ?, Liste de Produit_id = ?, EntrepotWM_id = ?'+
        'WHERE id = ?',
        [product.libelle, product.desc, product.photo, product.prix, product.reduction, product.dlc, product.codeBarre, product.enRayon,
        product.dateMiseEnRayon, product.CategorieProduit_id, product.listProduct_ID, product.EntrepotWM_id, product.id]);
        return res;
    }
    catch {
        return undefined;
    }
}

async updateProductCategory(categoryProduct) {
    try {
        const res = await Database.connection.execute('UPDATE `categorieproduit` SET libelle = ?'+
        'WHERE id = ?',
        [categoryProduct.libelle, categoryProduct.id]);
        return res;
    }
    catch {
        return undefined;
    }
}





//*******************************************         DELETE FUNCTIONS        ***************************************************************************************
async deleteProduct(id){
    try{
        
        const res = await Database.connection.execute('DELETE FROM produit WHERE product.id = ?', [id]);
       

        return res;
    }
    catch (err){
        console.log("error delete tavu : "+ err);
        return undefined;
    }
}

async deleteProductCategory(id){
    try{
        
        const res = await Database.connection.execute('DELETE FROM categorieproduit WHERE categorieproduct.id = ?', [id]);
       

        return res;
    }
    catch (err){
        console.log("error delete tavu : "+ err);
        return undefined;
    }
}
}
module.exports = new ProduitController();