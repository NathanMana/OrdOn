const Person = require('./Person');

/**
 * Classe réprésentant les différents professionnels de la santé
 * A l'avenir, le médecin et le pharmacien pourront être accompgnés d'autres personnes
 */
class Profesionnal extends Person {

    /**
     * Ville du lieu d'exercice
     */
    #city

    /**
     * Addresse du lieu d'exercice
     */
    #address

    /**
     * Code postal du lieu d'exercice
     */
    #zipcode

    /**
     * Constructeur de la classe Professionnal
     * @param {string} name 
     * @param {string} firstname 
     * @param {string} email 
     * @param {string} password 
     * @param {string} city 
     * @param {string} address 
     * @param {string} zipcode 
     */
    constructor(name, firstname, email, password, city, address, zipcode) {
        super(name, firstname, email, password)
        this.#city = city;
        this.#address = address;
        this.#zipcode = zipcode;
    }

    getCity() {return this.#city}
    setCity(city) {this.#city = city}

    getAddress() {return this.#address}
    setAddress(address) {this.#address = address}

    getZipcode() {return this.#zipcode}
    setZipcode(zipcode) {this.#zipcode = zipcode}
}


module.exports = Profesionnal