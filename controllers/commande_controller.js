const Database = require('../models/database');

class CommandeController {
    
    addCommande(date, utilisateurID ) {
       
        return Database.connection.execute('INSERT INTO commande (date, utilisateur_id) VALUES (?, ?)', [date, utilisateurID]);
    }
}

module.exports = new CommandeController();