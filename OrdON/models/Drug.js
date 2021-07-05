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

    getDrugId(){return this.#id_drug}
    setDrugId(id){this.#id_drug = id}

    getName(){return this.#name}

    toObject() {
        return {
            id_drug: this.#id_drug,
            name: this.#name
        }
    }

}

module.exports = Drug