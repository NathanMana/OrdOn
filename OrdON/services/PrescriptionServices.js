const mysql = require('mysql2/promise');
const Attribution = require('../models/Attribution');
const Prescription = require('../models/Prescription');
const AttributionService = require('./AttributionService');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: 'ordon',
    waitForConnections : true,
});

/**
 * Gère toutes les opérations sur la table Prescription
 */
class PrescriptionServices {
    /**
     * Ajoute une ordonnance
     * @param {Prescription} prescription 
     */
    static async addPrescription(prescription) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'INSERT INTO prescription(date_creation, isQRCodeVisible, id_doctor, id_patient) VALUES (?, false, ?, ?) ', 
                [prescription.getDateCreation(), prescription.getIdDoctor(), prescription.getIdPatient()]
            )
            if (!result) throw 'Une erreur est survenue'
            console.log("Prescription insérée")
            connection.release()
        } catch(e){
            console.log(e)
        }
    }

    /**
     * Récupère une ordonnance spécifique via son id
     * @param {long} idPrescription 
     * @returns {Prescription} l'ordonnance cherchée
     */
    static async getPrescriptionById(idPrescription) {
        try {
            if (!idPrescription || idPrescription <= 0) throw 'L\id indiqué est erroné'

            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM prescription WHERE id_prescription = ?', 
                [idPrescription]
            )
            if (!result) throw 'Une erreur est survenue'
            // On convertit le résultat en objet js
            const prescription = new Prescription()
            Object.assign(prescription, result[0][0])
            
            //On complete l'objet prescription avec les Attributions et les conseils
            prescription.setListAttributions(AttributionService.getListAttributionsByPrescriptionId(prescription.getIdPrescription()))
            prescription.setListCouncils(CouncilService.getListCouncilsByPrescriptionId(prescription.getIdPrescription()))
            
            connection.release()
            console.log('Presription récupérée')
            return prescription
        }
        catch (e) { console.log(e)}
    }
}

module.exports = PrescriptionServices