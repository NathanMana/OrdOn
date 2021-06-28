const mysql = require('mysql2/promise');
const Doctor = require('../models/Doctor');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: 'ordon',
    waitForConnections : true,
});

/**
 * Gère toutes les opérations sur la table Docteur
 */
 class DoctorServices {
    /**
     * Ajoute un docteur et le modifie pour lui attribuer un id encrypté unique
     * @param {Doctor} doctor 
     */
    static async addDoctor(doctor) {
        try {
            const object = doctor.toObject();
            const connection = await pool.getConnection();
            const result = await connection.query('INSERT INTO doctor SET ? ', object)
            if (!result) throw 'Une erreur est survenue'
            doctor.setId(result[0].insertId)
            doctor.setEncryptedId(doctor.encryptId(doctor.getId()))
            await connection.query('UPDATE doctor SET encryptedId = ? WHERE id_doctor = ? ', [doctor.getEncryptedId(), doctor.getId()])
            console.log("Docteur inséré")
            connection.release()
        } catch(e){
            console.log(e)
        }
    }

    /**
     * Modifie un doctor
     * @param {Doctor} doctor 
     */
     static async updateDoctor(doctor){
        try {
            if (!doctor.getId() || doctor.getId() <= 0) throw 'Le docteur n\'existe pas' 

            const connection = await pool.getConnection();
            await connection.query(
                `UPDATE doctor SET birthdate = ?, isQRCodeVisible = ?, name = ?, firstname = ?, email = ?, password = ?, 
                isAccountValidated = ? WHERE id_doctor = ?`, 
                [
                    doctor.getBirthdate(), doctor.isQRCodeVisible(), doctor.getName(), doctor.getFirstname(), doctor.getEmail(),
                    doctor.getPassword(), doctor.isAccountValidated(), doctor.getId()
                ]
            )
            connection.release()
            console.log("Docteur modifié")
        }
        catch(e) {
            console.log(e)
        }
    }

    /**
     * Supprime un Docteur
     * @param {Doctor} doctor 
     */
     static async deleteDoctorWithId(doctor) {
        try {
            if (!doctor || doctor.getId() <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            if (doctor.getId() != doctor.getEncryptedId().substring(29, 2)) throw 'L{\id clair et l\'id encrypté ne corresponde pas'
            const connection = await pool.getConnection();
            await connection.query(
                'DELETE FROM doctor WHERE id_doctor = ? AND encryptedId = ?', 
                [doctor.getId(), doctor.getEncryptedId()]
            )
            connection.release()
            console.log('Doctor supprimé')
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un docteur spécifique via son id clair
     * @param {long} idDoctor 
     * @returns {Doctor} le docteur cherché
     */
     static async getDoctorById(idDoctor) {
        try {
            if (!idDoctor || idDoctor <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM doctor WHERE id_doctor = ?', 
                [idDoctor]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('doctor récupéré')
            const doctor = new Doctor()
            return Object.assign(doctor, result[0][0])
        }
        catch (e) { console.log(e)}
    }
}

module.exports = DoctorServices


