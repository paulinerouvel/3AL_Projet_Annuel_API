'use strict';

class Commande {

  constructor(id, date, utilisateur_id, adresse_livraison, cp_livraison, ville_livraison) {
    this.id = id;
    this.date = date;
    this.utilisateur_id = utilisateur_id;
    this.adresse_livraison = adresse_livraison;
    this.ville_livraison = ville_livraison;
    this.cp_livraison = cp_livraison;
  }
}

module.exports = Commande;