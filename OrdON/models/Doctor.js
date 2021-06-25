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
     * @param {string} proofPath 
     */
    constructor(name, firstname, email, password, city, address, zipcode, proofPath) {
        super(name, firstname, email, password, city, address, zipcode, proofPath);
    }

    getDoctorId() {return this.#id_doctor}
    setDoctorId(id) {this.#id_doctor = id}

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
            id_doctor : this.#id_doctor,
            isAccountValidated : this.getIsAccountValidated(),
            encryptedId : this.getEncryptedId(),
            city : this.getCity(),
            zipcode : this.getZipcode(),
            address : this.getAddress(),
            proofPath : this.getProofPath()
        }
    }
}


module.exports = Doctor