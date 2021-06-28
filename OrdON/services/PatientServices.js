const mysql = require('mysql2/promise');
const Patient = require('../models/Patient');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: 'ordon',
    waitForConnections : true,
});

/**
 * Gère toutes les opérations sur la table Patient
 */
class PatientServices {
    /**
     * Ajoute un patient et le modifie pour lui attribuer un id encrypté unique
     * @param {Patient} patient 
     */
    static async addPatient(patient) {
        try {
            const object = patient.toObject()
            const connection = await pool.getConnection();
            const result = await connection.query('INSERT INTO patient SET ? ', object)
            if (!result) throw 'Une erreur est survenue'
            patient.setId(result[0].insertId)
            patient.setEncryptedId(patient.encryptId(patient.getId()))
            await connection.query('UPDATE patient SET encryptedId = ? WHERE id_patient = ? ', [patient.getEncryptedId(), patient.getId()])
            console.log("Patient inséré")
            connection.release()
        } catch(e){
            console.log(e)
        }
    }

    /**
     * Modifie un patient
     * @param {Patient} patient 
     */
    static async updatePatient(patient){
        try {
            if (!patient.getId() || patient.getId() <= 0) throw 'La patient n\'existe pas' 

            const connection = await pool.getConnection();
            await connection.query(
                `UPDATE patient SET birthdate = ?, isQRCodeVisible = ?, name = ?, firstname = ?, email = ?, password = ?, 
                isAccountValidated = ? WHERE id_patient = ?`, 
                [
                    patient.getBirthdate(), patient.isQRCodeVisible(), patient.getName(), patient.getFirstname(), patient.getEmail(),
                    patient.getPassword(), patient.isAccountValidated(), patient.getId()
                ]
            )
            connection.release()
            console.log("Patient modifié")
        }
        catch(e) {
            console.log(e)
        }
    }

    /**
     * Supprime un patient
     * @param {Patient} patient 
     */
    static async deletePatientWithId(patient) {
        try {
            if (!patient || patient.getId() <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            if (patient.getId() != patient.getEncryptedId().substring(29, 2)) throw 'L{\id clair et l\'id encrypté ne corresponde pas'
            const connection = await pool.getConnection();
            await connection.query(
                'DELETE FROM patient WHERE id_patient = ? AND encryptedId = ?', 
                [patient.getId(), patient.getEncryptedId()]
            )
            connection.release()
            console.log('Patient supprimé')
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un patient spécifique via son id clair
     * @param {long} idPatient 
     * @returns {Patient} le patient cherché
     */
    static async getPatientById(idPatient) {
        try {
            if (!idPatient || idPatient <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM patient WHERE id_patient = ?', 
                [idPatient]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('Patient récupéré')
            const patient = new Patient()
            return Object.assign(patient, result[0][0])
        }
        catch (e) { console.log(e)}
    }
}

module.exports = PatientServices