const Doctor = require('../models/Doctor');
const pool = require('./DatabaseConnection')

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
            if (!doctor.getDoctorId() || doctor.getDoctorId() <= 0) throw 'Le docteur n\'existe pas' 

            const connection = await pool.getConnection();
            await connection.query(
                `UPDATE doctor SET name = ?, firstname = ?, email = ?, password = ?, 
                isAccountValidated = ? WHERE id_doctor = ?`, 
                [
                    doctor.getName(), doctor.getFirstname(), doctor.getEmail(),
                    doctor.getPassword(), doctor.getIsAccountValidated(), doctor.getDoctorId()
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
                'SELECT * FROM doctor NATURAL JOIN professionnal WHERE id_doctor = ?', 
                [idDoctor]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('doctor récupéré')
            const doctorData = result[0][0]
            let doctor = new Doctor(
                doctorData.name,
                doctorData.firstname,
                doctorData.email,
                doctorData.password, 
                doctorData.city,
                doctorData.address,
                doctorData.zipcode
            )
            doctor.setDoctorId(doctorData.id_doctor)
            doctor.setEncryptedId(doctorData.encryptedId)
            doctor.setProfessionnalId(doctorData.id_professionnal)
            return doctor
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère une liste de médecins qui n'ont pas été validés
     * et qui ont fait une demande de validation
     */
     static async getListUnvalidatedDoctors() {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM doctor NATURAL JOIN professionnal WHERE isAccountValidated = false AND proofpath IS NOT NULL'
            )
            connection.release()
            if (!result[0]) return

            let listDoctors = []
            result[0].forEach(data => {
                let doctor = new Doctor(
                    data.name,
                    data.firstname,
                    data.email,
                    data.password, 
                    data.city,
                    data.address,
                    data.zipcode
                )
                doctor.setDoctorId(data.id_doctor)
                doctor.setEncryptedId(data.encryptedId)
                doctor.setProfessionnalId(data.id_professionnal)
                listDoctors.push(doctor)
            })
            return listDoctors
        }
        catch(e) {console.log(e)}
    }
}

module.exports = DoctorServices


