/**
 * Classe associative entre le pharmacien et une prescription
 */
class GivenAttribution {
    /**
     * Nombre de boite donnée au patient
     */
    #quantity

    /**
     * Date a laquelle les médicaments ont été donnés
     */
    #date

    /**
     * Indique si un problème a été indiqué sur le médicament
     */
    #isAlert

    /**
     * Id de l'attribution
     */
    #id_attribution

    /**
     * Id du pharmacien
     */
    #id_pharmacist



    /**
     * Constructeur de la classe GivenAttribution
     * @param {int} quantity 
     * @param {Date} date 
     * @param {boolean} isAlert 
     */
    constructor(quantity, date, isAlert) {
        this.#quantity = quantity
        this.#isAlert = isAlert
        this.#date = date
    }

    getIdAttribution() {return this.#id_attribution}
    setIdAttribution(id_attribution){this.#id_attribution = id_attribution}

    getQuantity(){return this.#quantity}
    setQuantity(quantity){this.#quantity = quantity}

    getDate(){return this.#date}
    setDate(date){this.#date = date}

    isAlert(){return this.#isAlert}
    setIsAlert(alert){this.#isAlert = isAlert}

    getIdPharmacist(){return this.#id_pharmacist}
    setIdPharm(id_pharmacist){this.#id_pharmacist = id_pharmacist}

    toObject(){
        return {
            quantity: this.#quantity,
            date: this.#date,
            isAlert: this.#isAlert,
            id_attribution: this.#id_attribution,
            id_pharmacist: this.#id_pharmacist
        }
    }
}

module.exports = GivenAttribution