const pool = require('./DatabaseConnection')('ordonPatient');
const Patient = require('../models/Patient')

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
            patient.setPatientId(result[0].insertId)
            patient.setEncryptedId(patient.encryptId(patient.getPatientId()))
            patient.setTokenEmail(patient.getEncryptedId() + patient.encryptId(patient.getPatientId()))
            await connection.query(
                'UPDATE patient SET encryptedId = ?, tokenEmail = ? WHERE id_patient = ? ', 
                [ patient.getEncryptedId(), patient.getTokenEmail(), patient.getPatientId()]
            )
            console.log("Patient inséré")
            connection.release()
            return patient
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
            if (!patient.getPatientId() || patient.getPatientId() <= 0) throw 'La patient n\'existe pas' 

            const connection = await pool.getConnection();
            await connection.query(
                `UPDATE patient SET birthdate = ?, qrCodeAccess = ?, name = ?, firstname = ?, email = ?, password = ?, 
                isAccountValidated = ?, weight = ?, gender = ?, isEmailVerified = ?, tokenEmail = ?, tokenResetPassword = ? WHERE id_patient = ?`, 
                [
                    patient.getBirthdate(), patient.getQRCodeAccess(), patient.getName(), patient.getFirstname(), patient.getEmail(),
                    patient.getPassword(), patient.isAccountValidated(), patient.getWeight(), patient.getGender(), patient.getIsEmailVerified(), 
                    patient.getTokenEmail(), patient.getTokenResetPassword(), patient.getPatientId()
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
    static async deletePatient(patient) {
        try {
            if (!patient || patient.getPatientId() <= 0) throw 'L\id indiqué est erroné'
            // récupérer la largeur de l'id clair
            const lengthId = (patient.getPatientId() + "").length
            const a = patient.getEncryptedId().substring(29, 29 + lengthId)
            // Double vérification avec l'id encrypté
            if (patient.getPatientId() != patient.getEncryptedId().substring(29, 29 + lengthId)) throw 'L{\id clair et l\'id encrypté ne corresponde pas'
            const connection = await pool.getConnection();
            await connection.query(
                'DELETE FROM patient WHERE id_patient = ? AND encryptedId = ?', 
                [patient.getPatientId(), patient.getEncryptedId()]
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
            const patientData = result[0][0]
            if (!patientData) return null
            const patient = new Patient(
                patientData.name,
                patientData.firstname,
                patientData.email,
                patientData.password,
                patientData.birthdate,
                patientData.weight
            )
            patient.setPatientId(patientData.id_patient)
            patient.setEncryptedId(patientData.encryptedId)
            patient.setGender(patientData.gender)
            patient.setIsAccountValidated(patientData.isAccountValidated)
            patient.setTokenEmail(patientData.tokenEmail)
            patient.setTokenResetPassword(patientData.tokenResetPassword)
            return patient
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère l'id d'un patient spécifique via son id encrypté
     * @param {long} encryptedId 
     * @returns {long} l'id clair
     */
    static async getPatientIdByEncryptedId(encryptedId) {
        try {
            if (!encryptedId) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT id_patient FROM patient WHERE encryptedId = ?', 
                [encryptedId]
            )
            if (!result[0][0]) return
            connection.release()
            // On convertit le résultat en objet js
            console.log('patient récupéré')
            return result[0][0].id_patient
        }
        catch (e) { console.log(e)}
    }


    /**
     * Récupère un patient spécifique via son id clair
     * @param {long} encryptedId 
     * @returns {Patient} le patient cherché
     */
     static async getPatientByEncryptedId(encryptedId) {
        try {
            if (!encryptedId) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM patient WHERE encryptedId = ?', 
                [encryptedId]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('Patient récupéré')
            const patientData = result[0][0]
            if (!patientData) return null
            const patient = new Patient(
                patientData.name,
                patientData.firstname,
                patientData.email,
                patientData.password,
                patientData.birthdate,
                patientData.gender,
                patientData.weight
            )
            patient.setPatientId(patientData.id_patient)
            patient.setEncryptedId(patientData.encryptedId)
            patient.setIsEmailVerified(patientData.isEmailVerified)
            patient.setIsAccountValidated(patientData.isAccountValidated)
            patient.setTokenEmail(patientData.tokenEmail)
            patient.setTokenResetPassword(patientData.tokenResetPassword)
            return patient
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un patient via son qr code
     * @param {long} qrCodeAccess 
     * @returns {Patient} le patient cherché
     */
     static async getPatientByQRCodeAccess(qrCodeAccess) {
        try {
            if (!qrCodeAccess) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM patient WHERE qrCodeAccess = ?', 
                [qrCodeAccess]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('Patient récupéré')
            const patientData = result[0][0]
            if (!patientData) return null
            const patient = new Patient(
                patientData.name,
                patientData.firstname,
                patientData.email,
                patientData.password,
                patientData.birthdate,
                patientData.gender,
                patientData.weight
            )
            patient.setPatientId(patientData.id_patient)
            patient.setEncryptedId(patientData.encryptedId)
            patient.setIsEmailVerified(patientData.isEmailVerified)
            patient.setTokenEmail(patientData.tokenEmail)
            patient.setTokenResetPassword(patientData.tokenResetPassword)
            return patient
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un patient spécifique via le token de l'email
     * @param {string} tokenEmail 
     * @returns {Patient} le patient cherché
     */
     static async getPatientByTokenEmail(tokenEmail) {
        try {
            if (!tokenEmail) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM patient WHERE tokenEmail = ?', 
                [tokenEmail]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('Patient récupéré')
            const patientData = result[0][0]
            if (!patientData) return null
            const patient = new Patient(
                patientData.name,
                patientData.firstname,
                patientData.email,
                patientData.password,
                patientData.birthdate,
                patientData.gender,
                patientData.weight
            )
            patient.setPatientId(patientData.id_patient)
            patient.setEncryptedId(patientData.encryptedId)
            patient.setIsEmailVerified(patientData.isEmailVerified)
            patient.setTokenEmail(patientData.tokenEmail)
            patient.setTokenResetPassword(patientData.tokenResetPassword)
            return patient
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère un patient spécifique via le token du resetPassword
     * @param {string} token
     * @returns {Patient} le patient cherché
     */
     static async getPatientByTokenResetPassword(token) {
        try {
            if (!token) throw 'L\id indiqué est erroné'

            // Double vérification avec l'id encrypté
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM patient WHERE tokenResetPassword = ?', 
                [token]
            )
            connection.release()
            // On convertit le résultat en objet js
            console.log('Patient récupéré')
            const patientData = result[0][0]
            if (!patientData) return null
            const patient = new Patient(
                patientData.name,
                patientData.firstname,
                patientData.email,
                patientData.password,
                patientData.birthdate,
                patientData.gender,
                patientData.weight
            )
            patient.setPatientId(patientData.id_patient)
            patient.setEncryptedId(patientData.encryptedId)
            patient.setIsEmailVerified(patientData.isEmailVerified)
            patient.setTokenEmail(patientData.tokenEmail)
            patient.setTokenResetPassword(patientData.tokenResetPassword)
            return patient
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
                'SELECT email FROM patient WHERE email = ?', 
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
                'SELECT password FROM patient WHERE email = ?', 
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
     * @returns {Patient} le patient
     */
    static async getPatientByEmail(email) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM patient WHERE email = ?',
                [email]
            )
            connection.release()
            const patientData = result[0][0]
            if (!patientData) return null
            const patient = new Patient(
                patientData.name,
                patientData.firstname,
                patientData.email,
                patientData.password,
                patientData.birthdate,
                patientData.weight
            )
            patient.setPatientId(patientData.id_patient)
            patient.setEncryptedId(patientData.encryptedId)
            patient.setGender(patientData.gender)
            patient.setIsEmailVerified(patientData.isEmailVerified)
            patient.setTokenEmail(patientData.tokenEmail)
            patient.setTokenResetPassword(patientData.tokenResetPassword)
            return patient
        }
        catch (e) {
            console.log(e)
        }
    }

    static async changeEmailPatient(patient){
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'UPDATE patient SET email = ? WHERE encryptedId= ?'
                [patient.getEmail(), patient.getEncryptedId()]
            )
            connection.release()
        }catch(e) {console.log(e)}
    }

    static async changePasswordPatient(patient){
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'UPDATE patient SET password = ? WHERE encryptedId= ?'
                [patient.getPassword(), patient.getEncryptedId()]
            )
            connection.release()
        }catch(e) {console.log(e)}
    }

}

module.exports = PatientServices