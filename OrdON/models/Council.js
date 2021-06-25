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
}

module.exports = Council