const pool = require('./DatabaseConnection')('ordon')

const Council = require('../models/Council');

/**
 * Gère toutes les opérations sur la table Attribution
 */
class CouncilServices {
    /**
     * Ajoute un conseil
     * @param {Council} council 
     */
    static async addCouncil(council) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'INSERT INTO council(description, id_prescription) VALUES (?, ?) ', 
                [council.getDescription(), council.getPrescriptionId()]
            )
            if (!result) throw 'Une erreur est survenue'
            console.log("Conseil inséré")
            connection.release()
        } catch(e){
            console.log(e)
        }
    }

    /**
     * Récupère un conseil
     * @param {long} idCouncil 
     * @returns {Council} le conseil
     */
    static async getCouncilById(idCouncil) {
        try {
            if (!idCouncil || idCouncil <= 0) throw 'L\id indiqué est erroné'

            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM council WHERE id_council = ?', 
                [idCouncil]
            )
            if (!result) throw 'Une erreur est survenue'
            // On convertit le résultat en objet js
            const council = new Council(
                result[0][0].description
            )
            council.setCouncilId(result[0][0].id_council)

            connection.release()
            console.log('Conseil récupéré')
            return council
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère une liste de conseils via l'id de l'ordonnance
     * @param {long} idPrescription 
     * @returns {array(Council)} les conseils cherchés
     */
     static async getListCouncilsByPrescriptionId(idPrescription) {
        try {
            if (!idPrescription || idPrescription <= 0) throw 'L\id indiqué est erroné'

            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM council WHERE id_prescription = ?', 
                [idPrescription]
            )
            if (!result) throw 'Une erreur est survenue'
            let listCouncils = []
            result[0].forEach((councilData) => {
                const council = new Council(
                    councilData.description
                )
                council.setCouncilId(councilData.id_council)
                listCouncils.push(council)
            })

            connection.release()
            console.log('Conseils récupérés')
            return listCouncils
        }
        catch (e) { console.log(e)}
    }
}

module.exports = CouncilServices