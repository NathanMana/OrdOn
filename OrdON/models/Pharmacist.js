const Profesionnal = require('./Profesionnal');

/**
 * Classe représentant le pharmacien
 */
class Pharmacist extends Profesionnal{

    /**
     * Id du pharmacien
     */
    #id_pharmacist

    #id_professionnal

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

    getPharmacistId(){return this.#id_pharmacist}
    setPharmacistId(id){this.#id_pharmacist = id}

    getProfessionnalId() {return this.#id_professionnal}
    setProfessionnalId(id) {this.#id_professionnal = id}

    /**
     * Permet une insertion plus rapide dans le service
     * Converti l'instance en object JS classique
     * @returns {Object}
     */
    toObject() {
        return {
            name : this.getName(),
            firstname : this.getFirstname(),
            email : this.getEmail(), 
            password : this.getPassword(),
            id_pharmacist : this.#id_pharmacist,
            isAccountValidated : this.getIsAccountValidated(),
            encryptedId : this.getEncryptedId(),
            city : this.getCity(),
            zipcode : this.getZipcode(),
            address : this.getAddress()
        }
    }
}


module.exports = Pharmacist