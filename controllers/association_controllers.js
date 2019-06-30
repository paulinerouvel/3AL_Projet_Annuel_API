'use strict';

const Database = require('../models/database');

class AssociationController {


    /***********************************************************************************/
    /**                                   ADD FUNCTIONS                               **/
    /***********************************************************************************/

    async addAssociation(libelle, taille, adresse, ville, codePostal, mail, tel, nomPresident, prenomPresident, photo, desc) {

        //return Database.connection.execute('INSERT INTO association (libelle, taille, adresse, ville, codePostal, mail, tel, nomPresident, prenomPresident, photo, desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [libelle, taille, adresse, ville, codePostal, mail, tel, nomPresident, prenomPresident, photo, desc]);
        //return Database.connection.execute(res);
        console.log(libelle, taille);
        return Database.connection.execute('INSERT INTO association (libelle, taille) VALUES (?,?)', [libelle, taille]);

    }
}

module.exports = new AssociationController();