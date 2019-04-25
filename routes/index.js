'use strict';

const database = require('../models/database');
class RouterBuilder {
   build(app) {
     app.use('/product', require('./produit_route')),
     app.use('/user', require('./utilisateur_route')),
     app.use('/order', require('./commande_route'))
    }
}

module.exports = new RouterBuilder();