const Profesionnal = require('./Profesionnal');

class Pharmacist extends Profesionnal{
    constructor(id_pharmacist){
        super(Profesionnal)
        this.id_pharmacist = id_pharmacist
    }

    getId(){return this.id_pharmacist}
}


module.exports = Pharmacist