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

    #id_prescription

    /**
     * Constructeur du conseil
     * @param {*} description 
     */
    constructor(description, id_prescription) {
        this.#description = description
        this.#id_prescription = id_prescription
    }

    getCouncilId(){return this.#id_council}
    setCouncilId(id){this.#id_council = id}

    getDescription(){return this.#description}
    setDescription(description){this.#description = description}

    getPrescriptionId(){return this.#id_prescription}
    setPrescriptionId(id){this.#id_prescription = id}
}

module.exports = Council