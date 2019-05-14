'use strict';

const database = require('../models/database');
class RouterBuilder {
   build(app) {
     app.use('/product', require('./produit_route')),
     app.use('/user', require('./utilisateur_route')),
     app.use('/order', require('./commande_route')),
     app.use('/alert', require('./alerte_route')),
     app.use('/key', require('./motCle_route')),
     app.use('/donation', require('./don_route')),
     app.use('/warehouse', require('./entrepot_route'))
    }
}

module.exports = new RouterBuilder();