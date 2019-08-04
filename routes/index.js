'use strict';

const cors = require('cors');

class RouterBuilder {
  build(app) {

    app.use(cors());

    // Add headers
    app.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,X-Requested-With,content-type, x-request-id');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);

      // Pass to next layer of middleware
      next();
    });

    app.use('/product', require('./produit_route')),
      app.use('/user', require('./utilisateur_route')),
      app.use('/order', require('./commande_route')),
      app.use('/alert', require('./alerte_route')),
      app.use('/donation', require('./don_route')),
      app.use('/warehouse', require('./entrepot_route')),
      app.use('/list', require('./list_route')),
      app.use('/mail', require('./mail_route')),
      app.use('/payement', require('./payement_route'))
  }
}

module.exports = new RouterBuilder();