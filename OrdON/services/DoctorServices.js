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
            doctor.setDoctorId(result[0].insertId)
            doctor.setEncryptedId(doctor.encryptId(doctor.getDoctorId()))
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
            await connection.query(
                `UPDATE professionnal SET city = ?, zipcode = ?, address = ?, proofpath = ? WHERE id_professionnal = ?`, 
                [doctor.getCity(), doctor.getZipcode(), doctor.getAddress(), doctor.getProofPath(), doctor.getProfessionnalId()]
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
            if (!doctor || doctor.getDoctorId() <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            if (doctor.getDoctorId() != doctor.getEncryptedId().substring(29, 2)) throw 'L{\id clair et l\'id encrypté ne corresponde pas'
            const connection = await pool.getConnection();
            await connection.query(
                'DELETE FROM doctor WHERE id_doctor = ? AND encryptedId = ?', 
                [doctor.getDoctorId(), doctor.getEncryptedId()]
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
    /*     "ca m'as l'air d'être 2 fois la même méthodes"
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
    */
    /**
     * Récupère une liste de médecins qui n'ont pas un compte validé
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
                doctorData.zipcode,
                doctorData.proofpath
            )
            doctor.setDoctorId(doctorData.id_doctor)
            doctor.setEncryptedId(doctorData.encryptedId)
            doctor.setProfessionnalId(doctorData.id_professionnal)
            return doctor
        }
        catch (e) { console.log(e)}
    }

    /**
     * vérifie si un email est déjà présent en bdd
     * @param {string} email 
     */
     static async isEmailPresent(email) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT email FROM doctor WHERE email = ?', 
                [email]
            )
            connection.release()
            if (result[0][0]) return true
            return false
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * vérifie si le password correspond à celui stocké en base
     * @param {String} password 
     * @param {String} email
     */
    static async isPasswordCorrect(password, email) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT password FROM doctor WHERE email = ?', 
                [email]
            )
            connection.release()
            if (bcrypt.compare(password, result[0][0])){ return true }
            return false
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un patient a partir d'un email et d'un mdp
     * @param {string} email
     * @returns {long} encryptedId
     */
    static async getDoctorByEmail(email) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT email FROM doctor WHERE email = ?',
                [email]
            )
            connection.release()
            const d = new Doctor()
            const doctor = object.assign(d, result[0][0])
            return doctor.encryptId
        }
        catch (e) {
            console.log(e)
        }
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
                    data.zipcode,
                    data.proofpath
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


