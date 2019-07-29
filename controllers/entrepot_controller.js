const Database = require('../models/database');
const Entrepot = require('../models/entrepot_model');
class EntrepotController {



    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/


    async addWarehouse(newWarehouse) {

        try{
            const res = await Database.connection.execute('INSERT INTO `entrepot` (`libelle`, `adresse`, `ville`, `codePostal`, `desc`, `photo`, `placeTotal`, `placeLibre`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            [newWarehouse.libelle, newWarehouse.adresse, newWarehouse.ville, newWarehouse.codePostal,
            newWarehouse.desc, newWarehouse.photo, newWarehouse.placeTotal, newWarehouse.placeLibre]);
            return res;
        }
        catch(err){
            console.log(err);
            return 500;
        }



    }


    /***********************************************************************************/
    /**                                   GET FUNCTIONS                               **/
    /***********************************************************************************/



    async getWarehouseByID(id) {
        // on select un entrepot avec son id

        try{
            const results = await Database.connection.query('SELECT * FROM entrepot WHERE entrepot.id = ?', [id]);
            const rows = results[0];
            if (rows.length > 0) {
                return new Entrepot(rows[0].id, rows[0].libelle, rows[0].adresse, rows[0].ville, rows[0].codePostal,
                    rows[0].desc, rows[0].photo, rows[0].placeTotal, rows[0].placeLibre);
            }

        }
        catch(err){
            console.log(err);
            return 500;
        }

    }

    async getWarehouseByCity(city) {

        try{
            const results = await Database.connection.query('SELECT * FROM entrepot WHERE entrepot.ville = ?', [city]);
            const rows = results[0];
            if (rows.length > 0) {
                return new Entrepot(rows[0].id, rows[0].libelle, rows[0].adresse, rows[0].ville, rows[0].codePostal,
                    rows[0].desc, rows[0].photo, rows[0].placeTotal, rows[0].placeLibre);
            }
        }
        catch(err){
            console.log(err);
            return 500;
        }

    }



    async getAllWarehouse() {
        try {
            const res = await Database.connection.query('SELECT * FROM `entrepot`');
            return res[0].map((rows) => new Entrepot(rows.id, rows.libelle, rows.adresse, rows.ville, rows.codePostal,
                rows.desc, rows.photo, rows.placeTotal, rows.placeLibre))
        }
        catch (err) {
            console.log(err);
            return 500;
        }

    }




    /***********************************************************************************/
    /**                                UPDATE FUNCTIONS                               **/
    /***********************************************************************************/
    async updateWarehouse(warehouse) {
        try {
            const res = await Database.connection.execute('UPDATE `entrepot` SET libelle = ?, adresse = ?, ville = ?,' +
                'codePostal = ?, desc = ?, photo = ?, placeTotal = ?, placeLibre = ?' +
                'WHERE id = ?',
                [warehouse.libelle, warehouse.adresse, warehouse.ville, warehouse.codePostal,
                warehouse.desc, warehouse.photo, warehouse.placeTotal, wareHouse.placeLibre, wareHouse.id]);

            return res;
        }
        catch {
            console.log(err);
            return 500;
        }
    }




    /***********************************************************************************/
    /**                                DELETE FUNCTIONS                               **/
    /***********************************************************************************/
    async deleteWarehouse(id) {
        try {

            const res = await Database.connection.execute('DELETE FROM entrepot WHERE entrepot.id = ?', [id]);
            return res;
        }
        catch (err) {
            console.log( err);
            return 500;
        }
    }
}

module.exports = new EntrepotController();