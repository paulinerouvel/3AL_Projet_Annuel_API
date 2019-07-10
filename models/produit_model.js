'use strict';

class Produit {

  constructor(id, libelle, desc, photo, prix, prixInitial, quantite, dlc, codeBarre, enRayon, dateMiseEnRayon, categorieProduit_id, listProduct_id, entrepotwm_id) {
    this.id = id;
    this.libelle = libelle;
    this.desc = desc;
    this.photo = photo;
    this.prix = prix;
    this.prixInitial = prixInitial || null;
    this.quantite = quantite || null;
    this.dlc = dlc;
    this.codeBarre = codeBarre || null;
    this.enRayon = enRayon ;
    this.dateMiseEnRayon = dateMiseEnRayon || null;
    this.categorieProduit_id = categorieProduit_id;
    this.listProduct_id = listProduct_id;
    this.entrepotwm_id = entrepotwm_id;
  }
}

module.exports = Produit;