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

    getQuantity(){return this.#quantity}
    setQuantity(quantity){this.#quantity = quantity}

    getDate(){return this.#date}
    setDate(date){this.#date = date}

    isAlert(){return this.#isAlert}
    setIsAlert(alert){this.#isAlert = isAlert}
}