const Database = require('../models/database');
const MotCle = require('../models/motCle_model');


class MotCleController {



    /***********************************************************************************/
    /**                                ADD FUNCTIONS                                  **/
    /***********************************************************************************/

    async addMotCle(motCle) {

        // crée un new mot clé (insert)
        return await Database.connection.execute('INSERT INTO `mot_cle` (`libelle`, Alerte_id) VALUES (?, ?);', [motCle.libelle, motCle.alerte_id]);
    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/


    async getMotCleByAlert_ID(alerte_id) {
        // on select les alertes avec l'id d'un utilisateur
        const results = await Database.connection.query('SELECT * FROM mot_cle WHERE mot_cle.alerte_id = ?', [alerte_id]);
        try {
            return results[0].map((rows) => new MotCle(rows.id, rows.libelle, rows.Alerte_id));
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }


    async getAllMotCle() {
        try {
            const res = await Database.connection.query('SELECT * FROM `mot_cle`');
            return res[0].map((rows) => new MotCle(rows.id, rows.libelle, rows.alerte_id)
            );
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }


    /***********************************************************************************/
    /**                                  UPDATE FUNCTIONS                             **/
    /***********************************************************************************/




    // A PREMIERE VUE PAS BESOIN D'UPDATE POUR LES MOT CLES



    //*******************************************         DELETE FUNCTIONS        ***************************************************************************************
    async deleteMotCle(motCleId, alerte_id) {
        try {

            const res = await Database.connection.execute('DELETE FROM mot_cle WHERE mot_cle.id = ? AND mot_cle.Alerte_id = ?', [motCleId, alerte_id]);


            return res;
        }
        catch (err) {
            return undefined;
        }
    }
}

module.exports = new MotCleController();