const Profesionnal = require('./Profesionnal');

class Doctor extends Profesionnal {

    /**
     * L'id du médecin
     */
    #id_doctor

    /**
     * Id pro
     */
    #id_professionnal

    /**
     * Constructeur de la classe Médecin
     * @param {string} name 
     * @param {string} firstname 
     * @param {string} email 
     * @param {string} password 
     * @param {string} city 
     * @param {string} address 
     * @param {string} zipcode 
     * @param {string} gender
     */
    constructor(name, firstname, email, password, city, address, zipcode, gender) {
        super(name, firstname, email, password, city, address, zipcode, gender);
    }

    getDoctorId() {return this.#id_doctor}
    setDoctorId(id) {this.#id_doctor = id}

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
            id_doctor : this.#id_doctor,
            isAccountValidated : this.getIsAccountValidated(),
            encryptedId : this.getEncryptedId(),
            city : this.getCity(),
            zipcode : this.getZipcode(),
            address : this.getAddress(),
            gender : this.getGender(),
            isEmailVerified : this.getIsEmailVerified()
        }
    }
}


module.exports = Doctor