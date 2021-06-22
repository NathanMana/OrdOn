const Profesionnal = require('./Profesionnal');

class Pharmacist extends Profesionnal{
    constructor(name, firstname, email, password, city, address, zipcode, typeProfesionnal, id_pharmacist = null){
        super(name, firstname, email, password, city, address, zipcode, typeProfesionnal)
        if (id_pharmacist) this.id_pharmacist = id_pharmacist
    }

    getId(){return this.id_pharmacist}
}


module.exports = Pharmacist