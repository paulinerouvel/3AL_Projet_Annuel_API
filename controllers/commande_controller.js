const Database = require('../models/database');
const Commande = require('../models/commande_model');

class CommandeController {
    
    addOrder(date, utilisateurID) {
       
        return Database.connection.execute('INSERT INTO commande (date, utilisateur_id) VALUES (?, ?)', [date, utilisateurID]);
    }

    addProductInOrder(product_id, product_categorieProduit_id, order_id, quantite) {
       
        return Database.connection.execute('INSERT INTO commande_has_produit (Produit_id, Produit_CategorieProduit_id, Commande_id, quantite) VALUES (?, ?, ?, ?)', 
        [product_id, product_categorieProduit_id, order_id, quantite]);
    }

//*******************************************         GET FUNCTIONS  (commande)      ***************************************************************************************
async getOrderByID(id) {
    // on select un utilisateur avec son prenom
    const results =  await Database.connection.query('SELECT * FROM commande WHERE commande.id = ?', [id]);
    const rows = results[0];
    if (rows.length > 0) {
        return new Commande(rows[0].id, rows[0].date, rows[0].Utilisateur_id);
    }
    return undefined;
}

async getUserByDate(date) {
    // on select un utilisateur avec son prenom
    const results =  await Database.connection.query('SELECT * FROM commande WHERE commande.date = ?', [date]);
    const rows = results[0];
    if (rows.length > 0) {
        return new Commande(rows[0].id, rows[0].date, rows[0].Utilisateur_id);
    }
    return undefined;
}


async getAllOrders(){
    try
    {
        const res = await Database.connection.query('SELECT * FROM `commande`');
        return res[0].map((rows) => new Commande(rows[0].id, rows[0].date, rows[0].Utilisateur_id));
    }
    catch(err) {
        console.log(err);
        return undefined;
    }
    
}

//*******************************************         GET FUNCTIONS  (commande_has_produit)      ***************************************************************************************



//*******************************************         UPDATE FUNCTIONS        ***************************************************************************************


// A TESTER / A CORRIGER
async updateQuantityCommande_has_produit(commande_id, produit_id, quantite) {
    try {
        const res = await Database.connection.execute('UPDATE `commande_has_produit` SET quantity = ? WHERE Produit_id = ? AND Commande_id = ?',
        [quantite, produit_id, commande_id]);
        return res;
    }
    catch {
        return undefined;
    }
}




//*******************************************         DELETE FUNCTIONS        ***************************************************************************************
async deleteOrder(id){
    try{
        
        const res = await Database.connection.execute('DELETE FROM commande WHERE commande.id = ?', [id]);
        return res;
    }
    catch (err){
        console.log("error delete tavu : "+ err);
        return undefined;
    }
}
}

module.exports = new CommandeController();