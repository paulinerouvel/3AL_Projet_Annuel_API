const Database = require('../models/database');
const Alerte = require('../models/alerte_model');
class AlerteController {
    
    async addAlerte(alerte) {
        
        // crée une new alerte avec les valeurs, puis ajouter ses valeurs dans l'INSERT pour éviter des erreurs et géré les NULLABLE
        return await Database.connection.execute('INSERT INTO `alerte` (`libelle`, date, Utilisateur_id ) VALUES (?, ?, ?);', [alerte.libelle, alerte.date, alerte.utilisateur_id]);
    }


    //*******************************************         GET FUNCTIONS        ***************************************************************************************
    async getAllAlertByUserID(id) {
        // on select les alertes avec l'id d'un utilisateur
        const results =  await Database.connection.query('SELECT * FROM alerte WHERE alerte.Utilisateur_id = ?', [id]);
        try {
            return results[0].map((rows) => new Alerte(rows.id, rows.libelle, rows.date, rows.Utilisateur_id));
        }
        catch(err) {
            console.log(err);
            return undefined;
        }
    }
    


    async getAlertOfTheDay(date) {
        // on select toutes les alertes enregistrées à cette date
        const results =  await Database.connection.query('SELECT * FROM alerte WHERE date = ?', [date]);
        try {
            return results[0].map((rows) => new Alerte(rows[0].id, rows[0].libelle, rows[0].date, rows[0].Utilisateur_id));
        }
        catch(err) {
            console.log(err);
            return undefined;
        }
    }


    async getAllAlerts(){
        try
        {
            const res = await Database.connection.query('SELECT * FROM `alerte`');
            return res[0].map((rows) => new Alerte(rows.id, rows.libelle, rows.date, rows.Utilisateur_id)
            );

        }
        catch(err) {
            console.log(err);
            return undefined;
        }
        
    }




    //*******************************************         UPDATE FUNCTIONS        ***************************************************************************************

    // A PREMIERE VUE PAS BESOIN D'UPDATE LES ALERTES



    //*******************************************         DELETE FUNCTIONS        ***************************************************************************************
    async deleteAlert(alertId, userId){
        try{
            
            console.log("user id = " + userId + "\nalertID = "+alertId);
            const res = await Database.connection.execute('DELETE FROM alerte WHERE alerte.utilisateur_id = ? AND alerte.id = ?', [userId, alertId]);
           

            return res;
        }
        catch (err){
            console.log("error delete tavu : "+ err);
            return undefined;
        }
    }
}

module.exports = new AlerteController();