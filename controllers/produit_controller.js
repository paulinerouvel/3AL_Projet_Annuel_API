'use strict';

// const models = require('../models');
// const Produit = models.Produit;
const Database = require('../models/database');

class ProduitController {
    
    addProduit(libelle, description, photo, prix, reduction, dlc, codeBarre, enRayon, dateMiseEnRayon) {
       //TODO avec une requête
        return Database.connection.execute('INSERT INTO produit (libelle, description, photo, prix, reduction, dlc, codeBarre, enRayon, dateMiseEnRayon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [libelle, description, photo, prix, reduction, dlc, codeBarre, enRayon, dateMiseEnRayon]);
    }
}

module.exports = new ProduitController();