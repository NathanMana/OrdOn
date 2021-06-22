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
        }
        catch(e) {
            console.log(e)
        }
    }
}

module.exports = PatientServices