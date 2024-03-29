const pool = require('./DatabaseConnection')('ordon')

const Attribution = require('../models/Attribution');
const MentionService = require('./MentionServices');
const DrugServices = require('./DrugServices');
const MentionAttributionServices = require('./MentionAttributionServices');
const GivenAttributionServices = require('./GivenAttributionServices')

/**
 * Gère toutes les opérations sur la table Attribution
 */
class AttributionServices {
    /**
     * Ajoute une prescription
     * @param {Attribution} attribution 
     */
    static async addAttribution(attribution) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'INSERT INTO attribution(description, quantity, id_prescription, id_drug) VALUES (?, ?, ?, ?) ', 
                [attribution.getDescription(), attribution.getQuantity(), attribution.getPrescriptionId(), attribution.getDrugId()]
            )
            if (!result) throw 'Une erreur est survenue'
            attribution.setAttributionId(result[0].insertId)
            console.log("Attribution insérée")
            connection.release()
            return attribution
        } catch(e){
            console.log(e)
        }
    }

    /**
     * Récupère une prescription spécifique via son id
     * @param {long} idAttribution 
     * @returns {Attribution} la prescription cherchée
     */
    static async getAttributionById(idAttribution) {
        try {
            if (!idAttribution || idAttribution <= 0) throw 'L\id indiqué est erroné'

            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM attribution WHERE id_attribution = ?', 
                [idAttribution]
            )
            if (!result[0][0]) throw 'Une erreur est survenue'
            // On convertit le résultat en objet js
            const attributionData = result[0][0]
            const attribution = new Attribution(
                attributionData.description,
                attributionData.quantity,
                attributionData.id_drug,
                attributionData.id_prescription,
                null
            )
            attribution.setAttributionId(attributionData.id_attribution)
            attribution.setPrescriptionId(attributionData.id_prescription)
            
            //On complete l'objet prescription avec les Attributions et les conseils
            const drug = DrugServices.getDrugById(attributionData.id_drug)
            attribution.setDrug(drug)
            const listMentions = MentionAttributionServices.getListMentionsByAttributionId(attribution.getAttributionId())
            attribution.setListMentions(listMentions)
            connection.release()
            console.log('Attribution récupérée')
            return attribution
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère une liste de prescription via l'id de l'ordonnance
     * @param {long} idPrescription 
     * @returns {array(Attribution)} la prescription cherchée
     */
     static async getListAttributionsByPrescriptionId(idPrescription) {
        try {
            if (!idPrescription || idPrescription <= 0) throw 'L\id indiqué est erroné'

            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM attribution WHERE id_prescription = ?', 
                [idPrescription]
            )
            if (!result) throw 'Une erreur est survenue'
            let listAttributions = []
            for (let i = 0; i < result[0].length; i++) {
                const attributionData = result[0][i]
                const attribution = new Attribution(
                    attributionData.description,
                    attributionData.quantity,
                    attributionData.id_drug,
                    attributionData.id_prescription,
                    null
                )
                attribution.setAttributionId(attributionData.id_attribution)
                
                //On complete l'objet prescription avec les Attributions et les conseils
                const drug = await DrugServices.getDrugById(attributionData.id_drug)
                attribution.setDrug(drug)
                const listMentions = await MentionAttributionServices.getListMentionsByAttributionId(attribution.getAttributionId())
                attribution.setListMentions(listMentions)
                const gAttribution = await GivenAttributionServices.getListGivenAttributionById(attribution.getAttributionId())
                attribution.setListGivenAttributions(gAttribution)                            
                listAttributions.push(attribution)
            }

            connection.release()
            console.log('Prescriptions récupérées')
            return listAttributions
        }
        catch (e) { console.log(e)}
    }
}

module.exports = AttributionServices