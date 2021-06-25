/**
 * Conseil sur une prescription
 */
class Council {

    /**
     * Id d'un conseil
     */
    #id_council

    /**
     * Description du conseil
     */
    #description

    /**
     * Constructeur du conseil
     * @param {*} description 
     */
    constructor(description) {
        this.#description = description
    }

    getCouncilId(){return this.#id_council}

    getDescription(){return this.#description}
    setDescription(description){this.#description = description}

    /**
     * Avant d'envoyer à la view, doit être transformé en objet classique
     */
    toObject() {
        return {
            id_council = this.#id_council,
            description = this.#description
        }
    }
}

module.exports = Council