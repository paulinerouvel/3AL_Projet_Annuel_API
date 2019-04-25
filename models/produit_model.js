'use strict';

class Produit {

  constructor(libelle, description, photo, prix, reduction, dlc, codeBarre, enRayon, dateMiseEnRayon) {
    this.libelle = libelle;
    this.description = description;
    this.photo = photo;
    this.prix = prix;
    this.reduction = reduction || null;
    this.dlc = dlc;
    this.codeBarre = codeBarre || null;
    this.enRayon = enRayon;
    this.dateMiseEnRayon = dateMiseEnRayon; // nos rayons ou ceux du magasin ?
  }
}

module.exports = Produit;