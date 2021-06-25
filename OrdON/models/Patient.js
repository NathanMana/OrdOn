const Person = require("./Person")

class Patient extends Person {
    
    /**
     * Id du patient
     */
    #id_patient

    /**
     * Indique si le QRCode du patient est visible
     */
    #isQrCodeVisible = false

    /**
     * Date de naissance
     */
    #birthdate

    /**
     * Constructeur de la classe Patient
     * @param {string} name 
     * @param {string} firstname 
     * @param {string} email 
     * @param {string} password 
     * @param {Date} birthdate 
     * @param {long} id_patient 
     */
    constructor(name, firstname, email, password, birthdate) {
        super(name, firstname, email, password)
        this.#birthdate = birthdate
    }

    getPatientId(){return this.#id_patient}
    setPatientId(idpatient){this.#id_patient = idpatient}
    
    isQrCodeVisible() {return this.#isQrCodeVisible}
    setIsQrCodeVisible(isQrCodeVisible) {
        this.#isQrCodeVisible = isQrCodeVisible
    }

    getBirthdate(){return this.#birthdate}
    setBirthdate(birthdate){this.#birthdate = birthdate}

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
            birthdate : this.#birthdate,
            id_patient : this.#id_patient,
            isQrCodeVisible : this.#isQrCodeVisible,
            isAccountValidated : this.isAccountValidated(),
            encryptedId : this.getEncryptedId()
        }
    }
}

module.exports = Patient