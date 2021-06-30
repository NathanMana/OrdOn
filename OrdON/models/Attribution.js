/**
 * Représente une prescription sur une ordonnance donnée
 */
class Attribution {

    /**
     * Id de la prescription
     */
    #id_attribution

    /**
     * Description de la prescription
     */
    #description

    /**
     * Quantité de boites
     */
    #quantity

    /**
     * Médicament prescrit
     * @type {Drug}
     */
    #drug

    /**
     * Liste des mentions pour une prescription
     * @type {Mention}
     */
    #listMentions = []

    /**
     * Id de l'ordonnance (parent)
     * @type {long}
     */
    #id_prescription


    //Manque l'id de la prescription
    constructor(description, quantity, drug, listMentions){
        this.#description = description
        this.#quantity = quantity
        this.#drug = drug
        this.#listMentions = listMentions
    }

    getAttributionId(){return this.#id_attribution}

    getDescription(){return this.#description}
    setDescription(description){this.#description = description}

    getQuantity(){return this.#quantity}
    setQuantity(quantity){this.#quantity = quantity}

    getDrug(){return this.#drug}
    setDrug(drug){this.#drug = drug}

    getListMentions(){return this.#listMentions}
    /**
     * Ajoute une mention à la prescription
     * @param {Mention} mention 
     */
    addMention(mention){
        this.#listMentions.push(mention)
    }
    /**
     * Retire une mention de la liste
     * @param {Mention} mention 
     * @returns 
     */
    removeMention(mention) {
        const index = this.#listMentions.find(c => c.getIdMention() === mention.getIdMention())
        if (index === -1) return
        this.#listMentions.splice(index, 1)
    }
    setListMentions(listMentions){this.#listMentions = listMentions}

    getPrescriptionId(){return this.#id_prescription}
    setPrescriptionId(id){this.#id_prescription = id}
}

module.exports = Attribution