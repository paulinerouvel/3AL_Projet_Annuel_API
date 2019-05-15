'use strict'


class Association {
    constructor(id, libelle, taille, adresse, ville, codePostal, mail, tel, nomPresident, prenomPresident, photo, desc) {
        this.id = id;
        this.libelle = libelle;
        this.taille = taille;
        this.adresse = adresse;
        this.ville = ville;
        this.codePostal = codePostal;
        this.mail = mail;
        this.tel=tel;
        this.nomPresident = nomPresident;
        this.prenomPresident = prenomPresident;
        this.photo = photo;
        this.desc=desc;
    }
}

module.exports = Association;