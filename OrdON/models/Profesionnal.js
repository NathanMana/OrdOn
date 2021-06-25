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
     * Lien vers l'image de "preuve"
     */
    #proofPath

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
    constructor(name, firstname, email, password, city, address, zipcode, proofPath) {
        super(name, firstname, email, password)
        this.#city = city;
        this.#address = address;
        this.#zipcode = zipcode;
        this.#proofPath = proofPath
    }

    getCity() {return this.#city}
    setCity(city) {this.#city = city}

    getAddress() {return this.#address}
    setAddress(address) {this.#address = address}

    getZipcode() {return this.#zipcode}
    setZipcode(zipcode) {this.#zipcode = zipcode}

    getProofPath() {return this.#proofPath}
    setProofPath(proofPath) {this.#proofPath = proofPath}
}


module.exports = Profesionnal