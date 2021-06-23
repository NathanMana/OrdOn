/**
 * Classe représentant l'ordonnance
 */
class Prescriptions {

    /**
     * id de l'ordonnance
     */
    #id_prescription

    /**
     * Date a laquelle l'ordonnance a été prescrite
     */
    #date_creation

    /**
     * Indique si le QRCode esy visible
     */
    #isQrCodeVisible = false

    /**
     * la liste des médicaments prescrits
     * {Array(Attribution)}
     */
    #listAttributions

    /**
     * La liste des "conseils" prescrits
     * {Array(Council)}
     */
    #listCouncils

    /**
     * L'id du patient a laquelle l'ordonnance est ratachée
     */
    #id_patient

    /**
     * L'id du docteur qui a prescrit l'ordonnance
     */
    #id_doctor

    /**
     * Constructeur de la classe Prescription
     * @param {long} id_doctor 
     * @param {long} id_patient 
     * @param {Array(Attribution)} listAttributions 
     * @param {Array(Council)} listCouncils 
     */
    constructor(id_doctor, id_patient, listAttributions, listCouncils){
        this.#id_doctor = id_doctor
        this.#id_patient = id_patient
        this.#date_creation = date_creation
        this.#listCouncils = listCouncils
        this.#listAttributions = listAttributions
    }

    getIdPrescription(){return this.#id_prescription}
    setIdPrescription(id){this.#id_prescription = id}

    getIdDoctor() {return this.#id_doctor}

    getIdPatient(){return this.#id_patient}

    getDateCreation(){return this.#date_creation}

    getListCouncils(){return this.#listCouncils}
    /**
     * Ajoute un conseil à la liste des conseils
     * @param {Council} council 
     */
    addCouncil(council){
        this.#listCouncils.push(council)
    }
    /**
     * Retire un conseil de la liste
     * @param {Council} council 
     * @returns 
     */
    removeCouncil(council) {
        const index = this.#listCouncils.find(c => c.getIdCouncil() === council.getIdCouncil())
        if (index === -1) return
        this.#listCouncils.splice(index, 1)
    }
    setListCouncils(listCouncils){this.#listCouncils = listCouncils}

    isQrCodeVisible(){return this.#isQrCodeVisible}
    setIsQrCodeVisible(isQrCodeVisible){
        this.isQrCodeVisible = isQrCodeVisible
    }

    getListAttributions(){return this.#listAttributions}
    /**
     * Ajoute une prescription sur l'ordonnance
     * @param {*} attribution 
     */
    addAttribution(attribution){
        this.#listAttributions.push(attribution)
    }
    /**
     * Retire une prescription de l'ordonnance
     * @param {*} attribution 
     * @returns 
     */
    removeAttribution(attribution){
        const index = this.#listAttributions.find(c => c.getIdAttribution() === attribution.getIdAttribution())
        if (index === -1) return
        this.#listAttributions.splice(index, 1)
    }
    setListAttributions(listAttributions){this.#listAttributions = listAttributions}

}

module.exports = Prescriptions