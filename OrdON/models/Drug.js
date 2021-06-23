/**
 * Médicament
 */
class Drug {

    /**
     * Id du médicament
     */
    #id_drug

    /**
     * Nom du médicament
     */
    #name 

    /**
     * Constructeur de la classe Drug
     * @param {string} name 
     */
    constructor(name) {
        this.#name = name
    }

    getIdDrug(){return this.#id_drug}

    getName(){return this.#name}

}