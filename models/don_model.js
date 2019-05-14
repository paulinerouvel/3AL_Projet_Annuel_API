'use strict';

class Don {

  constructor(id, date, montant, type, Donneur_id, Receveur_id) {
    this.id = id;
    this.date = date;
    this.montant = montant;
    this.type = type;
    this.Donneur_id = Donneur_id;
    this.Receveur_id = Receveur_id;
  }
}

module.exports = Don;


