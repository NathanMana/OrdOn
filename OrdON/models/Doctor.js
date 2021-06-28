const Profesionnal = require('./Profesionnal');

class Doctor extends Profesionnal {

    /**
     * L'id du médecin
     */
    #id_doctor

    /**
     * Constructeur de la classe Médecin
     * @param {string} name 
     * @param {string} firstname 
     * @param {string} email 
     * @param {string} password 
     * @param {string} city 
     * @param {string} address 
     * @param {string} zipcode 
     */
    constructor(name, firstname, email, password, city, address, zipcode) {
        super(name, firstname, email, password, city, address, zipcode);
    }

    getId() {return this.#id_doctor}
    setId(id) {this.#id_doctor = id}
}


module.exports = Doctor