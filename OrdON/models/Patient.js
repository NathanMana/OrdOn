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
     * Indique si le compte du patient est validée
     */
    #isAccountValidated = false

    /**
     * Date de naissance
     */
    #birthdate

    /**
     * poids
     */
    #weight

    /**
     * Constructeur de la classe Patient
     * @param {string} name 
     * @param {string} firstname 
     * @param {string} email 
     * @param {string} password 
     * @param {Date} birthdate 
     * @param {long} id_patient 
     */
    constructor(name, firstname, email, password, birthdate, gender, weight = null) {
        super(name, firstname, email, password, gender)
        this.#birthdate = birthdate
        this.#weight = weight
    }

    getPatientId(){return this.#id_patient}
    setPatientId(idpatient){this.#id_patient = idpatient}
    
    getIsQrCodeVisible() {return this.#isQrCodeVisible}
    setIsQrCodeVisible(isQrCodeVisible) {
        this.#isQrCodeVisible = isQrCodeVisible
    }

    isAccountValidated(){return this.#isAccountValidated}
    setIsAccountValidated(isAccountValidated){
        this.#isAccountValidated  = isAccountValidated
    }

    getBirthdate(){return this.#birthdate}
    setBirthdate(birthdate){this.#birthdate = birthdate}

    getWeight(){return this.#weight}
    setWeight(weight){this.#weight = weight}

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
            weight: this.#weight,
            id_patient : this.#id_patient,
            isQrCodeVisible : this.#isQrCodeVisible,
            isAccountValidated : this.isAccountValidated(),
            encryptedId : this.getEncryptedId(),
            gender : this.getGender(),
            isEmailVerified : this.getIsEmailVerified(),
            tokenEmail : this.getTokenEmail(),
            tokenResetPassword : this.getTokenResetPassword()
        }
    }
}

module.exports = Patient