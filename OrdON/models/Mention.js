/**
 * Représente les mentions possibles pour une prescription
 * QSP, AR, etc..
 */
class Mention {

    /**
     * Nom de la mention (ou cygle)
     */
    #name

    /**
     * Constructeur de la classe Mention
     * @param {string} name 
     */
    constructor(name){
        this.#name = name
    }

    getName(){return this.#name}
    setName(name){this.#name = name}

}

module.exports = Mention