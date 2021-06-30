/**
 * Classe représentant l'ordonnance
 */
 class Prescriptions {

    /**
     * id de l'ordonnance
     */
    #id_prescription

    /**
     * id de l'ordonnance hashée
     */
     #encryptedId

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
     * @type {long}
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

    getPrescriptionId(){return this.#id_prescription}
    setPrescriptionId(id){this.#id_prescription = id}

    getDoctorId() {return this.#id_doctor}

    getPatientId(){return this.#id_patient}

    getDateCreation(){return this.#date_creation}

    // Permet de récupérer l'id encrypté
    getEncryptedId() { return this.#encryptedId }
    // Permet de modifier l'id encrypté (a ne jamais utiliser autrement qu'à l'ajout en BDD)
    setEncryptedId(encryptedId) { this.#encryptedId = encryptedId}

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

    /**
     * Permet de transformer l'id de l'ordonnance en un id plus secret
     * Algorithme inspiré par https://www.codegrepper.com/code-examples/javascript/javascript+generate+unique+key
     * @param {long} id 
     * @returns {string} l'id encrypté
     */
    encryptId(id) {
        return ('xxxx-xxxx-9xxx-yxxx-xxxxxxxxxxxxxxxx'+id+'xxxxxxx').replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    toObject() {
        return {
            id_prescription: this.#id_prescription,
            encryptedId: this.#encryptedId,
            date_creation: this.#date_creation,
            isQrCodeVisible: this.#isQrCodeVisible,
            listAttributions: this.#listAttributions,
            listCouncils: this.#listCouncils,
            id_patient: this.#id_patient,
            id_doctor: this.#id_doctor
        }
    }

}

module.exports = Prescriptions