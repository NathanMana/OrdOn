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

    getName(){return this.#name}


    /**
     * Avant d'envoyer à la view, doit être transformé en objet classique
     */
    toObject() {
        return {
            id_drug = this.#id_drug,
            name = this.#name
        }
    }

}