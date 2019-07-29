'use strict';

class Don {

  constructor(id, date, montant, Donneur_id, Receveur_id) {
    this.id = id;
    this.date = date;
    this.montant = montant;
    this.Donneur_id = Donneur_id;
    this.Receveur_id = Receveur_id;
  }
}

module.exports = Don;


