const Profesionnal = require('./Profesionnal');

class Doctor extends Profesionnal {
    constructor(id_doctor) {
        super(Profesionnal);
        this.id_doctor = id_doctor
    }

    getId() {return this.id_doctor}
}


module.exports = Doctor