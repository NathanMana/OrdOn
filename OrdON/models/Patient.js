const Person = require("./Person")

class Patient extends Person {

    isQrCodeVisible = true

    constructor(id_patient, birthdate) {
        super(Person)
        this.id_patient = id_patient
        this.birthdate = birthdate
    }

    setIsQrCodeVisible(isQrCodeVisible) {
        this.isQrCodeVisible = isQrCodeVisible
    }

    setIdPatient(id_patient){this.id_patient = id_patient}

    setBirthdate(birthdate){this.birthdate = birthdate}

    getIsQrCodeVisible() {return this.isQrCodeVisible}

    getId(){return this.id_patient}

    getBirthdate(){return this.birthdate}
}


module.exports = Patient