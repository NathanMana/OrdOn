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
            const result_pro = await connection.query('INSERT INTO professionnal (city, address, zipcode) VALUES (?, ?, ?)', 
                [doctor.getCity(), doctor.getAddress(), doctor.getZipcode()])
            if (!result_pro) throw 'Une erreur est survenue'
            doctor.setProfessionnalId(result_pro[0].insertId)
            const doctor_insert = {
                name: doctor.getName(),
                firstname: doctor.getFirstname(),
                email: doctor.getEmail(),
                password: doctor.getPassword(),
                isAccountValidated: doctor.getIsAccountValidated(),
                isEmailVerified: doctor.getIsEmailVerified(),
                gender: doctor.getGender(),
                id_professionnal: doctor.getProfessionnalId()
            }
            const result = await connection.query('INSERT INTO doctor SET ? ', doctor_insert)
            if (!result) throw 'Une erreur est survenue'
            doctor.setDoctorId(result[0].insertId)
            doctor.setEncryptedId(doctor.encryptId(doctor.getDoctorId()))
            doctor.setTokenEmail(doctor.getEncryptedId() + doctor.encryptId(doctor.getDoctorId()))
            await connection.query(
                'UPDATE doctor SET encryptedId = ?, tokenEmail = ? WHERE id_doctor = ? ', 
                [doctor.getEncryptedId(), doctor.getTokenEmail(), doctor.getDoctorId()]
            )
            console.log("Docteur inséré")
            connection.release()
            return doctor;
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
                `UPDATE doctor SET name = ?, firstname = ?, email = ?, password = ?, isEmailVerified = ?,
                isAccountValidated = ?, tokenEmail = ?, tokenResetPassword = ? WHERE id_doctor = ?`, 
                [
                    doctor.getName(), doctor.getFirstname(), doctor.getEmail(),doctor.getPassword(),doctor.getIsEmailVerified(),
                    doctor.getIsAccountValidated(), doctor.getTokenEmail(), doctor.getTokenResetPassword(), doctor.getDoctorId()
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
     * Supprime un docteur
     * @param {Doctor} doctor 
     */
     static async deleteDoctor(doctor) {
        try {
            if (!doctor || doctor.getDoctorId() <= 0) throw 'L\id indiqué est erroné'
            // récupérer la largeur de l'id clair
            const lengthId = (doctor.getDoctorId() + "").length
            const a = doctor.getEncryptedId().substring(29, 29 + lengthId)
            // Double vérification avec l'id encrypté
            if (doctor.getDoctorId() != doctor.getEncryptedId().substring(29, 29 + lengthId)) throw 'L{\id clair et l\'id encrypté ne corresponde pas'
            const connection = await pool.getConnection();
            connection.query(
                'DELETE FROM doctor WHERE id_doctor = ? AND encryptedId = ?', 
                [doctor.getDoctorId(), doctor.getEncryptedId()]
            )
            connection.query(
                'DELETE FROM professionnal WHERE id_professionnal = ?', 
                [doctor.getProfessionnalId()]
            )
            connection.release()
            console.log('Patient supprimé')
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
            doctor.setTokenEmail(doctorData.tokenEmail)
            doctor.setTokenResetPassword(doctorData.tokenResetPassword)
            doctor.setIsAccountValidated(doctorData.isEmailVerified)
            doctor.setIsEmailVerified(doctorData.isEmailVerified)
            return doctor
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un docteur spécifique via son token email
     * @param {string} token 
     * @returns {Doctor} le docteur cherché
     */
     static async getDoctorByTokenEmail(token) {
        try {
            if (!token || token <= 0) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM doctor NATURAL JOIN professionnal WHERE tokenEmail = ?', 
                [token]
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
            doctor.setTokenEmail(doctorData.tokenEmail)
            doctor.setTokenResetPassword(doctorData.tokenResetPassword)
            doctor.setIsAccountValidated(doctorData.isEmailVerified)
            doctor.setIsEmailVerified(doctorData.isEmailVerified)
            return doctor
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un docteur spécifique via son id clair
     * @param {long} encryptedId 
     * @returns {Doctor} le docteur cherché
     */
     static async getDoctorByEncryptedId(encryptedId) {
        try {
            if (!encryptedId) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM doctor NATURAL JOIN professionnal WHERE encryptedId = ?', 
                [encryptedId]
            )
            connection.release()
            if(!result[0][0]) throw 'Pas de résultat'
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
            doctor.setTokenEmail(doctorData.tokenEmail)
            doctor.setTokenResetPassword(doctorData.tokenResetPassword)
            doctor.setIsAccountValidated(doctorData.isEmailVerified)
            doctor.setIsEmailVerified(doctorData.isEmailVerified)
            // On convertit le résultat en objet js
            console.log('doctor récupéré')
            return doctor
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un docteur a partir d'un email et d'un mdp
     * @param {string} email
     * @returns {Doctor} le docteur
     */
     static async getDoctorByEmail(email) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM doctor WHERE email = ?',
                [email]
            )
            connection.release()
            const doctorData = result[0][0]
            if (!doctorData) return null
            const doctor = new Doctor(
                doctorData.name,
                doctorData.firstname,
                doctorData.email,
                doctorData.password,
            )
            doctor.setDoctorId(doctorData.id_doctor)
            doctor.setEncryptedId(doctorData.encryptedId)
            doctor.setProfessionnalId(doctorData.id_professionnal)
            doctor.setTokenEmail(doctorData.tokenEmail)
            doctor.setTokenResetPassword(doctorData.tokenResetPassword)
            doctor.setIsAccountValidated(doctorData.isAccountValidated)
            doctor.setIsEmailVerified(doctorData.isEmailVerified)
            return doctor
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
                    data.zipcode
                )
                doctor.setDoctorId(data.id_doctor)
                doctor.setEncryptedId(data.encryptedId)
                doctor.setProfessionnalId(data.id_professionnal)
                doctor.setTokenEmail(data.tokenEmail)
                doctor.setTokenResetPassword(data.tokenResetPassword)
                doctor.setIsAccountValidated(data.isAccountValidated)
                doctor.setIsEmailVerified(data.isEmailVerified)
                listDoctors.push(doctor)
            })
            return listDoctors
        }
        catch(e) {console.log(e)}
    }

    static async changeEmailDoctor(doctor){
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'UPDATE doctor SET email = ? WHERE encryptedId= ?'
                [doctor.getEmail(), doctor.getEncryptedId()]
            )
            connection.release()
        }catch(e) {console.log(e)}
    }

    static async changePasswordDoctor(doctor){
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'UPDATE doctor SET password = ? WHERE encryptedId= ?'
                [doctor.getPassword(), doctor.getEncryptedId()]
            )
            connection.release()
        }catch(e) {console.log(e)}
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

}

module.exports = DoctorServices


