/**
 * Classe associative entre mention et Attribution
 */
class MentionAttribution {

    /**
     * Id de la prescription
     */
    #id_attribution

    /**
     * Id de la mention associée
     */
    #id_mention

    /**
     * Constructeur de la classe MentionAttribution
     * @param {long} idAttribution 
     * @param {long} idMention 
     */
    constructor(idAttribution, idMention) {
        this.#id_attribution = idAttribution
        this.#id_mention = idMention
    }

    getIdAttribution(){return this.#id_attribution}
    getIdMention(){return this.#id_mention}

}