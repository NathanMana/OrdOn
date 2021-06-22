const Profesionnal = require('./Profesionnal');

class Doctor extends Profesionnal {
    constructor(name, firstname, email, password, city, address, zipcode, typeProfesionnal, id_doctor = null) {
        super(Profesionnal);
        if (id_doctor) this.id_doctor = id_doctor
    }

    getId() {return this.id_doctor}
}


module.exports = Doctor