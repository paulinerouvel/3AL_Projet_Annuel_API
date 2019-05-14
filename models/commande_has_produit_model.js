'use strict';

class Commande_has_produit {

  constructor(produit_id, produit_CategorieProduit_id, commande_id, quantite) {
    
    this.produit_id = produit_id;
    this.produit_CategorieProduit_id = produit_CategorieProduit_id;
    this.commande_id = commande_id;
    this.quantite = quantite;
  }
}

module.exports = Commande_has_produit;