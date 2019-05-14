'use strict';

class Alerte {

  constructor(id, libelle, date, utilisateurID) {
    this.id = id;
    this.libelle = libelle;
    this.date = date;
    this.utilisateur_id = utilisateurID;
  }
}

module.exports = Alerte;