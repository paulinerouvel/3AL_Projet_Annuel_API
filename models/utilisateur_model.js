'use strict'


class Utilisateur {
    constructor(id, libelle, nom, prenom, mail, tel, adresse, ville, codePostal, pseudo, mdp, photo, desc, tailleOrganisme, estValide, siret, dateDeNaissance, nbPointsSourire) {
        this.id = id;
        this.libelle = libelle;
        this.nom = nom;
        this.prenom = prenom;
        this.mail = mail;
        this.tel=tel;
        this.adresse = adresse;
        this.ville = ville;
        this.codePostal = codePostal;
        this.pseudo = pseudo;
        this.mdp = mdp;
        this.photo = photo || null;
        this.desc=desc || null;
        this.tailleOrganisme = tailleOrganisme || 0;
        this.estValide = estValide;
        this.siret = siret;
        this.dateDeNaissance = dateDeNaissance || null;
        this.nbPointsSourire = nbPointsSourire || 0;
    }
}

module.exports = Utilisateur;