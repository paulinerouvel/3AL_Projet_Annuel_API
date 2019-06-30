const Database = require('../models/database');
const Don = require('../models/don_model');


class DonController {


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/

    async addDon(don) {

        // crée un new don 
        return await Database.connection.execute('INSERT INTO `don` (date, montant, type, Donneur_id, Receveur_id ) VALUES (?, ?, ?, ?, ?);', [don.date, don.montant, don.type, don.Donneur_id, don.Receveur_id]);
    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/
    async getAllDonByDonneurID(id) {
        // on select les alertes avec l'id d'un utilisateur
        const results = await Database.connection.query('SELECT * FROM don WHERE don.Donneur_id = ?', [id]);
        try {
            return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.type, rows.Donneur_id, rows.Receveur_id));
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async getAllDonByReceveurID(id) {
        // on select les alertes avec l'id d'un utilisateur
        const results = await Database.connection.query('SELECT * FROM don WHERE don.Receveur_id = ?', [id]);
        try {
            return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.type, rows.Donneur_id, rows.Receveur_id));
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async getDonOfTheDay(date) {
        // on select toutes les alertes enregistrées à cette date
        const results = await Database.connection.query('SELECT * FROM don WHERE date = ?', [date]);
        try {
            return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.type, rows.Donneur_id, rows.Receveur_id));
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }


    async getAllDons() {
        try {
            const res = await Database.connection.query('SELECT * FROM `don`');
            return res[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.type, rows.Donneur_id, rows.Receveur_id));


        }
        catch (err) {
            console.log(err);
            return undefined;
        }

    }




    /***********************************************************************************/
    /**                               UPDATE FUNCTIONS                                **/
    /***********************************************************************************/
    // TO DO



    /***********************************************************************************/
    /**                              DELETE FUNCTIONS                                 **/
    /***********************************************************************************/
    // Normalement pas de delete de don mais sait-on jamais
    async deleteDon(id) {
        try {

            const res = await Database.connection.execute('DELETE FROM don WHERE don.id', [id]);
            return res;
        }
        catch (err) {
            return undefined;
        }
    }
}

module.exports = new DonController();