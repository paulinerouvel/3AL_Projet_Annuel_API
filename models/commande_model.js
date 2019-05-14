'use strict';

class Commande {

  constructor(id, date, utilisateurID) {
    this.id = id;
    this.date = date;
    this.utilisateurID = utilisateurID;
  }
}

module.exports = Commande;