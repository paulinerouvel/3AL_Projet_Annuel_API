const Database = require('../models/database');
const Payement = require('../models/payement_model');


class PayementController {


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/

    async addPayement(payement) {
        try{
            return await Database.connection.execute('INSERT INTO `payement` (montant, titulaire, adresse_facturation, cp_facturation, ville_facturation, id_don, id_commande ) VALUES (?, ?, ?, ?, ?, ?, ?);', [payement.montant, payement.titulaire, payement.adresse_facturation, payement.cp_facturation, payement.ville_facturation, payement.id_don, payement.id_commande]);
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "payement_controller.js", "addPayement");
            return 500;
        }
    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/
    async getAllPayement() {
        
        try {
            const results = await Database.connection.query('SELECT * FROM payement');

            return results[0].map((rows) => new Payement(rows.id, rows.montant, rows.titulaire, rows.adresse_facturation, rows.cp_facturation, rows.ville_facturation, rows.id_don, rows.id_commande));

        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "payement_controller.js", "getAllPayement");
            return 500;
        }
    }
}

module.exports = new PayementController();