const Profesionnal = require('./Profesionnal');

/**
 * Classe représentant le pharmacien
 */
class Pharmacist extends Profesionnal{

    /**
     * Id du pharmacien
     */
    #id_pharmacist

    /**
     * Constructeur de la classe Pharmacist
     * @param {string} name 
     * @param {string} firstname 
     * @param {string} email 
     * @param {string} password 
     * @param {string} city 
     * @param {string} address 
     * @param {string} zipcode 
     */
    constructor(name, firstname, email, password, city, address, zipcode){
        super(name, firstname, email, password, city, address, zipcode)
    }

    getId(){return this.#id_pharmacist}
    setId(id){this.#id_pharmacist = id}
}


module.exports = Pharmacist