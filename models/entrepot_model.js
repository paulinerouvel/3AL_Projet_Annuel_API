'use strict';

class Entrepot {

  constructor(id, libelle, adresse, ville, codePostal, desc, photo, placeTotal, placeLibre) {
    this.id = id;
    this.libelle = libelle;
    this.adresse = adresse;
    this.ville = ville;
    this.codePostal = codePostal;
    this.desc = desc;
    this.photo = photo || null;
    this.placeTotal = placeTotal;
    this.placeLibre = placeLibre;

  }
}

module.exports = Entrepot;