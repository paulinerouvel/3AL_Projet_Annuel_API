'use strict';

module.exports = {
  Database: require('./database'),

  Alerte : require('./alerte_model'),
  Categorie_produit : require('./categorie_produit_model'),
  Categorie_utilisateur: require('./categorie_utilisateur_model'),
  Commande_has_produit: require('./commande_has_produit_model'),
  Commande: require('./commande_model'),
  Don: require('./don_model'),
  Entrepot: require('./entrepot_model'),
  Liste_produit : require('./liste_produit_model'),
  Payement : require('./payement_model'),
  Produit: require('./produit_model'),
  Utilisateur_has_categorie : require('./utilisateur_has_categorie_model'),
  Utilisateur: require('./utilisateur_model')
  
};  
