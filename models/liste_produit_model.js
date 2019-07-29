'use strict';

class Liste_produit {

  constructor(id, libelle, date, Utilisateur_id, estArchive) {
    this.id = id;
    this.libelle = libelle;
    this.date = date;
    this.Utilisateur_id = Utilisateur_id;
    this.estArchive = estArchive;
  }
}

module.exports = Liste_produit;


