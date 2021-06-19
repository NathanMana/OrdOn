const Person = require('./Person');

class Profesionnal extends Person {
    constructor(city, address, zipcode, typeProfesionnal) {
        super(Person)
        this.city = city;
        this.address = address;
        this.zipcode = zipcode;
        this.typeProfesionnal = typeProfesionnal
    }

    getcity() {return this.city}

    getAddress() {return this.address}

    getZipcode() {return this.zipcode}

    getTypeProfesionnal() {return this.typeProfesion}

    setCity(city) {this.city = city}

    setAddress(address) {this.address = address}

    setZipcode(zipcode) {this.zipcode = zipcode}

    setTypeProfesionnal(typeProfesionnal) {this.typeProfesionnal = typeProfesionnal;}
}


module.exports = Profesionnal