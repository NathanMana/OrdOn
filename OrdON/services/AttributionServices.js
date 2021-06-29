const pool = require('./DatabaseConnection')

const Attribution = require('../models/Attribution');
const MentionService = require('./MentionServices')

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
                [attribution.getDescription(), attribution.getQuantity(), attribution.getIdPrescription(), attribution.getDrug().getIdDrug()]
            )
            if (!result) throw 'Une erreur est survenue'
            console.log("Attribution insérée")
            connection.release()
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
            if (!result) throw 'Une erreur est survenue'
            // On convertit le résultat en objet js
            const attribution = new Attribution()
            Object.assign(attribution, result[0][0])

            //On complete l'objet prescription avec les Attributions et les conseils
            const listMentions = MentionService.getListMentionsByAttributionId(attribution.getIdAttribution())
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
            result[0].forEach((attributionData) => {
                const attribution = new Attribution()
                Object.assign(attribution, attributionData)
                attribution.setListMentions(MentionService.getListMentionsByAttributionId(attribution.getIdAttribution()))
                listAttributions.push(attribution)
            })

            connection.release()
            console.log('Prescriptions récupérées')
            return listAttributions
        }
        catch (e) { console.log(e)}
    }
}

module.exports = AttributionServices