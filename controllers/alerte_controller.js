const Database = require('../models/database');
const Alerte = require('../models/alerte_model');
const manage_logs = require("../utils/manage_logs");

class AlerteController {

    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/

    async addAlerte(alerte) {
        try{
            return await Database.connection.execute('INSERT INTO `alerte` (`libelle`, date, Utilisateur_id ) VALUES (?, ?, ?);',
            [alerte.libelle, alerte.date, alerte.utilisateur_id]);
        }
        catch(err){
            console.log(err);
            manage_logs.generateLogs(err, "alerte_controller.js", "addAlerte");
            return 500;
        }

    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/

    async getAllAlertByUserID(id) {
        
        try {
            const results = await Database.connection.query('SELECT * FROM alerte WHERE alerte.Utilisateur_id = ?', [id]);
            return results[0].map((rows) => new Alerte(rows.id, rows.libelle, rows.date, rows.Utilisateur_id));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "alerte_controller.js", "getAllAlertByUserID");
            return 500;
        }
    }



    async getAlertOfTheDay(date) {
        
        try {
            const results = await Database.connection.query('SELECT * FROM alerte WHERE date = ?', [date]);
            return results[0].map((rows) => new Alerte(rows[0].id, rows[0].libelle, rows[0].date, rows[0].Utilisateur_id));
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "alerte_controller.js", "getAlertOfTheDay");
            return 500;
        }
    }


    async getAllAlerts() {
        try {
            const res = await Database.connection.query('SELECT * FROM `alerte`');
            return res[0].map((rows) => new Alerte(rows.id, rows.libelle, rows.date, rows.Utilisateur_id)
            );
        }
        catch (err) {
            console.log(err);
            manage_logs.generateLogs(err, "alerte_controller.js", "getAllAlerts");
            return 500;
        }

    }



    /***********************************************************************************/
    /**                                DELETE FUNCTIONS                               **/
    /***********************************************************************************/

    async deleteAlert(alertId) {
        try {

            return await Database.connection.execute('DELETE FROM alerte WHERE alerte.id = ?', [alertId]);

        }
        catch (err) {
            console.log( err);
            manage_logs.generateLogs(err, "alerte_controller.js", "deleteAlert");
            return 500;
        }
    }
}

module.exports = new AlerteController();