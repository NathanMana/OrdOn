const Attribution = require('../models/Attribution');
const Prescription = require('../models/Prescription');
const AttributionServices = require('./AttributionServices');
const AttributionService = require('./AttributionServices');
const CouncilServices = require('./CouncilServices');
const pool = require('./DatabaseConnection')('ordon');
const DoctorServices = require('./DoctorServices');
const PatientServices = require('./PatientServices');

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
                'INSERT INTO prescription(date_creation, id_doctor, id_patient) VALUES (?, ?, ?) ', 
                [prescription.getDateCreation(), prescription.getDoctorId(), prescription.getPatientId()]
            )
            if (!result) throw 'Une erreur est survenue'
            prescription.setPrescriptionId(result[0].insertId)
            prescription.setEncryptedId(prescription.encryptId(prescription.getPatientId()))
            await connection.query(
                'UPDATE prescription SET encryptedId = ? WHERE id_prescription = ? ', 
                [prescription.getEncryptedId(), prescription.getPrescriptionId()]
            )
            console.log("Prescription insérée")
            connection.release()
            return prescription
        } catch(e){
            console.log(e)
        }
    }

    /**
     * Met à jour le qr code access
     * @param {Prescription} prescription 
     */
    static async updateQRCodeAccess(prescription) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'UPDATE prescription SET qrCodeAccess = ? WHERE encryptedId = ?',
                [prescription.getQRCodeAccess(), prescription.getEncryptedId()]
            )
            connection.release()
            console.log('Qr code mis à jour')
            return
        }
        catch (e) { console.log(e)}
    }

    /**
     * Met à jour le qr code access
     * @param {Prescription} prescription 
     */
     static async updateDatePrescription(prescription) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'UPDATE prescription SET date_archived = ?  WHERE encryptedId = ?',
                [
                    prescription.getDateArchived(), prescription.getEncryptedId()
                ]
            )
            connection.release()
            console.log('Prescription mise à jour')
            return
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère une ordonnance spécifique via son id
     * @param {long} idPrescription 
     * @returns {Prescription} l'ordonnance cherchée
     */
    static async getPrescriptionById(encryptedId) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM prescription WHERE encryptedId = ?', // rajouter un et 3 ans <
                [encryptedId]
            )
            connection.release()
            const prescriptionData = result[0][0]
            if (!prescriptionData) return null

            const prescription = new Prescription(
                prescriptionData.id_doctor,
                prescriptionData.id_patient,
                null,
                null
            )
            //On complete l'objet prescription avec les Attributions et les conseils
            prescription.setPrescriptionId(prescriptionData.id_prescription)
            const listAttributions = await AttributionServices.getListAttributionsByPrescriptionId(prescription.getPrescriptionId())
            prescription.setListAttributions(listAttributions)
            const listCouncils = await CouncilServices.getListCouncilsByPrescriptionId(prescription.getPrescriptionId())
            prescription.setListCouncils(listCouncils)
            prescription.setEncryptedId(prescriptionData.encryptedId)
            const doctor = await DoctorServices.getDoctorById(prescriptionData.id_doctor)
            prescription.setDoctor(doctor)
            const patient = await PatientServices.getPatientById(prescriptionData.id_patient)
            prescription.setPatient(patient)
            prescription.setQRCodeAccess(prescriptionData.qrCodeAccess)
            
            connection.release()
            console.log('Presriptions récupérées')
            return prescription
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère une ordonnance spécifique via son id
     * @param {long} idPrescription 
     * @returns {Prescription} l'ordonnance cherchée
     */
     static async getPrescriptionById2(id) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM prescription WHERE id_prescription = ?', // rajouter un et 3 ans <
                [id]
            )
            connection.release()
            const prescriptionData = result[0][0]
            if (!prescriptionData) return null

            const prescription = new Prescription(
                prescriptionData.id_doctor,
                prescriptionData.id_patient,
                null,
                null
            )
            //On complete l'objet prescription avec les Attributions et les conseils
            prescription.setPrescriptionId(prescriptionData.id_prescription)
            const listAttributions = await AttributionServices.getListAttributionsByPrescriptionId(prescription.getPrescriptionId())
            prescription.setListAttributions(listAttributions)
            const listCouncils = await CouncilServices.getListCouncilsByPrescriptionId(prescription.getPrescriptionId())
            prescription.setListCouncils(listCouncils)
            prescription.setEncryptedId(prescriptionData.encryptedId)
            const doctor = await DoctorServices.getDoctorById(prescriptionData.id_doctor)
            prescription.setDoctor(doctor)
            const patient = await PatientServices.getPatientById(prescriptionData.id_patient)
            prescription.setPatient(patient)
            prescription.setQRCodeAccess(prescriptionData.qrCodeAccess)
            
            connection.release()
            console.log('Presriptions récupérées')
            return prescription
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère une ordonnance via son qr code
     * @param {long} idPrescription 
     * @returns {Prescription} l'ordonnance cherchée
     */
     static async getPrescriptionByQRCodeAccess(qrCodeAccess) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM prescription WHERE qrCodeAccess = ?',
                [qrCodeAccess]
            )
            connection.release()
            const prescriptionData = result[0][0]
            if (!prescriptionData) return null

            const prescription = new Prescription(
                prescriptionData.id_doctor,
                prescriptionData.id_patient,
                null,
                null
            )
            //On complete l'objet prescription avec les Attributions et les conseils
            prescription.setPrescriptionId(prescriptionData.id_prescription)
            const listAttributions = await AttributionServices.getListAttributionsByPrescriptionId(prescription.getPrescriptionId())
            prescription.setListAttributions(listAttributions)
            const listCouncils = await CouncilServices.getListCouncilsByPrescriptionId(prescription.getPrescriptionId())
            prescription.setListCouncils(listCouncils)
            prescription.setEncryptedId(prescriptionData.encryptedId)
            const doctor = await DoctorServices.getDoctorById(prescriptionData.id_doctor)
            prescription.setDoctor(doctor)
            const patient = await PatientServices.getPatientById(prescriptionData.id_patient)
            prescription.setPatient(patient)
            prescription.setQRCodeAccess(prescriptionData.qrCodeAccess)
            
            connection.release()
            console.log('Presriptions récupérées')
            return prescription
        }
        catch (e) { console.log(e)}
    }

    /**
     * Récupère une liste d'ordonnances valides et qui n'ont pas encore été archivées
     * @return Array(Prescription)
     */
    static async getListValidPrescriptionsByPatientId(id, limit = null) {
        try {
            const connection = await pool.getConnection();
            let limitQuery = ''
            if (limit) {
                limitQuery = 'LIMIT ' + limit
            }
            const result = await connection.query(
                'SELECT * FROM prescription WHERE id_patient = ? AND date_archived IS NULL AND DATE_ADD(date_creation, INTERVAL 3 MONTH) >= CURDATE() ' + limitQuery, // rajouter un et 3 ans <
                [id]
            )
            connection.release()
            const listPrescriptions = []
            for (let i = 0; i < result[0].length; i++) {
                const prescriptionData = result[0][i]
                const prescription = new Prescription(
                    prescriptionData.id_doctor,
                    prescriptionData.id_patient,
                    null,
                    null
                )
                //On complete l'objet prescription avec les Attributions et les conseils
                prescription.setPrescriptionId(prescriptionData.id_prescription)
                const listAttributions = await AttributionServices.getListAttributionsByPrescriptionId(prescription.getPrescriptionId())
                prescription.setListAttributions(listAttributions)
                const listCouncils = await CouncilServices.getListCouncilsByPrescriptionId(prescription.getPrescriptionId())
                prescription.setListCouncils(listCouncils)
                prescription.setEncryptedId(prescriptionData.encryptedId)
                const doctor = await DoctorServices.getDoctorById(prescriptionData.id_doctor)
                prescription.setDoctor(doctor)
                const patient = await PatientServices.getPatientById(prescriptionData.id_patient)
                prescription.setPatient(patient)
                prescription.setQRCodeAccess(prescriptionData.qrCodeAccess)
                prescription.setDateCreation(prescriptionData.date_creation)

                listPrescriptions.push(prescription)
            }
            
            connection.release()
            console.log('Presriptions récupérées')
            return listPrescriptions
        }
        catch(e) {console.log(e)}
    }

    /**
     * Récupère une liste d'ordonnances valides et qui n'ont pas encore été archivées
     * @return Array(Prescription)
     */
     static async getListInvalidPrescriptionsByPatientId(id, limit = null) {
        try {
            const connection = await pool.getConnection();
            let limitQuery = ''
            if (limit) {
                limitQuery = 'LIMIT ' + limit
            }
            const result = await connection.query(
                'SELECT * FROM prescription WHERE id_patient = ? AND (date_archived IS NOT NULL OR (date_archived IS NULL AND DATE_ADD(date_creation, INTERVAL 3 MONTH) < CURDATE())) ' + limitQuery,
                [id]
            )
            connection.release()
            const listPrescriptions = []
            for (let i = 0; i < result[0].length; i++) {
                const prescriptionData = result[0][i]
                const prescription = new Prescription(
                    prescriptionData.id_doctor,
                    prescriptionData.id_patient,
                    null,
                    null
                )
                //On complete l'objet prescription avec les Attributions et les conseils
                prescription.setDateCreation(prescriptionData.date_creation)
                prescription.setDateArchived(prescriptionData.date_archived)
                prescription.setPrescriptionId(prescriptionData.id_prescription)
                const listAttributions = await AttributionServices.getListAttributionsByPrescriptionId(prescription.getPrescriptionId())
                prescription.setListAttributions(listAttributions)
                const listCouncils = await CouncilServices.getListCouncilsByPrescriptionId(prescription.getPrescriptionId())
                prescription.setListCouncils(listCouncils)
                prescription.setEncryptedId(prescriptionData.encryptedId)
                const doctor = await DoctorServices.getDoctorById(prescriptionData.id_doctor)
                prescription.setDoctor(doctor)
                const patient = await PatientServices.getPatientById(prescriptionData.id_patient)
                prescription.setPatient(patient)
                prescription.setQRCodeAccess(prescriptionData.qrCodeAccess)

                listPrescriptions.push(prescription)
            }
            
            connection.release()
            console.log('Presriptions récupérées')
            return listPrescriptions
        }
        catch(e) {console.log(e)}
    }


    /**
     * Récupère une liste d'ordonnances valides et qui n'ont pas encore été archivées
     * @return Array(Prescription)
     */
     static async getListPrescriptionsByPharmacistId(id) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM ordon.prescription NATURAL JOIN ordon.attribution LEFT JOIN ordon.given_attribution ON ordon.given_attribution.id_attribution = ordon.attribution.id_attribution WHERE ordon.given_attribution.id_pharmacist = ?',
                [id]
            )
            connection.release()
            const listPrescriptions = []
            for (let i = 0; i < result[0].length; i++) {
                const prescriptionData = result[0][i]
                const prescription = new Prescription(
                    prescriptionData.id_doctor,
                    prescriptionData.id_patient,
                    null,
                    null
                )
                //On complete l'objet prescription avec les Attributions et les conseils
                prescription.setDateCreation(prescriptionData.date_creation)
                prescription.setDateArchived(prescriptionData.date_archived)
                prescription.setPrescriptionId(prescriptionData.id_prescription)
                const listAttributions = await AttributionServices.getListAttributionsByPrescriptionId(prescription.getPrescriptionId())
                prescription.setListAttributions(listAttributions)
                const listCouncils = await CouncilServices.getListCouncilsByPrescriptionId(prescription.getPrescriptionId())
                prescription.setListCouncils(listCouncils)
                prescription.setEncryptedId(prescriptionData.encryptedId)
                const doctor = await DoctorServices.getDoctorById(prescriptionData.id_doctor)
                prescription.setDoctor(doctor)
                const patient = await PatientServices.getPatientById(prescriptionData.id_patient)
                prescription.setPatient(patient)
                prescription.setQRCodeAccess(prescriptionData.qrCodeAccess)

                listPrescriptions.push(prescription)
            }
            
            connection.release()
            console.log('Presriptions récupérées')
            return listPrescriptions
        }
        catch(e) {console.log(e)}
    }

}

module.exports = PrescriptionServices