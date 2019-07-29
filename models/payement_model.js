'use strict';

class Payement {

  constructor(id, montant, titulaire, adresse_facturation, cp_facturation, ville_facturation, id_don, id_commande) {
    this.id = id;
    this.montant = montant;
    this.titulaire = titulaire;
    this.adresse_facturation = adresse_facturation;
    this.cp_facturation = cp_facturation;
    this.ville_facturation = ville_facturation;
    this.id_don = id_don;
    this.id_commande = id_commande;
  }
}

module.exports = Payement;