const Database = require('../models/database');
const Don = require('../models/don_model');


class PayementController {


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/

    // async addDon(don) {

    //     try{

        
    //         return await Database.connection.execute('INSERT INTO `don` (date, montant, Donneur_id, Receveur_id ) VALUES (?, ?, ?, ?);', [don.date, don.montant, don.Donneur_id, don.Receveur_id]);
    
    //     }
    //     catch (err) {
    //         console.log(err);
    //         return 500;
    //     }
    // }


    // /***********************************************************************************/
    // /**                                   GET FUNCTIONS                               **/
    // /***********************************************************************************/
    // async getAllDonByDonneurID(id) {
        
    //     try {
    //         const results = await Database.connection.query('SELECT * FROM don WHERE don.Donneur_id = ?', [id]);

    //         return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant, rows.Donneur_id, rows.Receveur_id));

    //     }
    //     catch (err) {
    //         console.log(err);
    //         return 500;
    //     }
    // }

    // async getAllDonByReceveurID(id) {
        
    //     try {
    //         const results = await Database.connection.query('SELECT * FROM don WHERE don.Receveur_id = ?', [id]);
    //         return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant,  rows.Donneur_id, rows.Receveur_id));
    //     }
    //     catch (err) {
    //         console.log(err);
    //         return 500;
    //     }
    // }

    // async getDonOfTheDay(date) {
        
    //     try {
    //         const results = await Database.connection.query('SELECT * FROM don WHERE date = ?', [date]);
    //         return results[0].map((rows) => new Don(rows.id, rows.date, rows.montant,  rows.Donneur_id, rows.Receveur_id));
    //     }
    //     catch (err) {
    //         console.log(err);
    //         return 500;
    //     }
    // }


    // async getAllDons() {
    //     try {
    //         const res = await Database.connection.query('SELECT * FROM `don`');
    //         return res[0].map((rows) => new Don(rows.id, rows.date, rows.montant,  rows.Donneur_id, rows.Receveur_id));

    //     }
    //     catch (err) {
    //         console.log(err);
    //         return 500;
    //     }

    // }





    // /***********************************************************************************/
    // /**                              DELETE FUNCTIONS                                 **/
    // /***********************************************************************************/

    // async deleteDon(id) {
    //     try {

    //         const res = await Database.connection.execute('DELETE FROM don WHERE don.id', [id]);
    //         return res;
    //     }
    //     catch (err) {
    //         console.log(err)
    //         return 500;
    //     }
    // }
}

module.exports = new PayementController();