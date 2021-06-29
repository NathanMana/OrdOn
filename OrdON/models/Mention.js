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
     * Id de la mention (ou cygle)
     */
    #id_mention

    /**
     * Constructeur de la classe Mention
     * @param {string} name 
     * @param {long} id_mention
     */

    //Rajouter l'id de la mention et le getter 
    constructor(name, id_mention){
        this.#name = name
        this.#id_mention = id_mention
    }

    getName(){return this.#name}
    setName(name){this.#name = name}

    getIdMention(){return this.#id_mention}
    setIdMention(id){this.#id_mention = id}
}

module.exports = Mention