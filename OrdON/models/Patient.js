const Person = require("./Person")

class Patient extends Person {

    isQrCodeVisible = false
    isAccountValidated = false
    encryptedId = null

    constructor(name, firstname, email, password,birthdate, id_patient = null) {
        super(name, firstname, email, password)
        this.birthdate = birthdate
        if (id_patient) this.id_patient = id_patient
    }

    setIsQrCodeVisible(isQrCodeVisible) {
        this.isQrCodeVisible = isQrCodeVisible
    }

    setIdPatient(id_patient){this.id_patient = id_patient}

    setBirthdate(birthdate){this.birthdate = birthdate}

    isQrCodeVisible() {return this.isQrCodeVisible}

    getId(){return this.id_patient}
    setId(idpatient){this.id_patient = idpatient}

    getBirthdate(){return this.birthdate}

    // Permet de récupérer l'id encrypté
    getEncryptedId() { return this.encryptedId }
    // Permet de modifier l'id encrypté (a ne jamais utiliser autrement qu'à l'ajout en BDD)
    setEncryptedId(encryptedId) { this.encryptedId = encryptedId}

    toObject() {
        return {
            name : this.name,
            firstname : this.firstname,
            email : this.email, 
            password : this.password,
            birthdate : this.birthdate,
            id_patient : this.id_patient,
            isQrCodeVisible : this.isQrCodeVisible,
            isAccountValidated : this.isAccountValidated,
            encryptedId : this.encryptedId
        }
    }
}


module.exports = Patient