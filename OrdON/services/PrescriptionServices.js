const Attribution = require('../models/Attribution');
const Prescription = require('../models/Prescription');
const AttributionServices = require('./AttributionServices');
const AttributionService = require('./AttributionServices');
const CouncilServices = require('./CouncilServices');
const pool = require('./DatabaseConnection');
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
                'INSERT INTO prescription(date_creation, isQRCodeVisible, id_doctor, id_patient) VALUES (?, false, ?, ?) ', 
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
     * Récupère une ordonnance spécifique via son id
     * @param {long} idPrescription 
     * @returns {Prescription} l'ordonnance cherchée
     */
    static async getPrescriptionById(idPrescription) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM prescription WHERE id_patient = ? AND date_archived IS NOT NULL LIMIT 4', // rajouter un et 3 ans <
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
            prescription.setPrescriptionId(prescriptionData.prescription_id)
            prescription.setEncryptedId(prescriptionData.encryptedId)
            const doctor = await DoctorServices.getDoctorById(prescriptionData.id_doctor)
            prescription.setDoctor(doctor)
            const patient = await PatientServices.getPatientById(prescriptionData.id_patient)
            prescription.setPatient(patient)
            
            connection.release()
            console.log('Presriptions récupérées')
            return listPrescriptions
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
                'SELECT * FROM prescription WHERE id_patient = ? AND date_archived IS NULL ' + limitQuery, // rajouter un et 3 ans <
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
                prescription.setPrescriptionId(prescriptionData.prescription_id)
                prescription.setEncryptedId(prescriptionData.encryptedId)
                const doctor = await DoctorServices.getDoctorById(prescriptionData.id_doctor)
                prescription.setDoctor(doctor)
                const patient = await PatientServices.getPatientById(prescriptionData.id_patient)
                prescription.setPatient(patient)

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
     static async getListInvalidPrescriptionsByPatientId(id) {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM prescription WHERE id_patient = ? AND date_archived IS NOT NULL LIMIT 4', // rajouter un et 3 ans <
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
                prescription.setPrescriptionId(prescriptionData.prescription_id)
                prescription.setEncryptedId(prescriptionData.encryptedId)
                const doctor = await DoctorServices.getDoctorById(prescriptionData.id_doctor)
                prescription.setDoctor(doctor)
                const patient = await PatientServices.getPatientById(prescriptionData.id_patient)
                prescription.setPatient(patient)

                listPrescriptions.push(prescription)
            }
            
            connection.release()
            console.log('Presriptions récupérées')
            return listPrescriptions
        }
        catch(e) {console.log(e)}
    }


     /**
     * @returns {listPrescription} la liste d'ordonnance
     */
      static async displayPrescriptionPatient(id_patient){
        try {
            listPrescriptionNoneArchived = []
            listePrescriptionArchived = []
            const connection = await pool.getConnection();
            const result = await connection.query(
                'SELECT * FROM prescription WHERE id_patient= ? AND date_archived IS NULL',
                [id_patient], function(err,rows){
                    rows.forEach(element => {
                        // On convertit le résultat en objet js
                        const prescription = new Prescription()
                        Object.assign(prescription, element[0][0])
                        //On complete l'objet prescription avec les Attributions et les conseils
                        prescription.setListAttributions(AttributionService.getListAttributionsByPrescriptionId(prescription.getIdPrescription()))
                        prescription.setListCouncils(CouncilService.getListCouncilsByPrescriptionId(prescription.getIdPrescription()))
                        listPrescriptionNoneArchived.add(prescription)
                    });    
                })
                if (!result) throw 'Une erreur est survenue'
                const result2 = await connection.query(
                    'SELECT * FROM prescription WHERE id_patient= ? AND date_archived IS NOT NULL',
                    [id_patient], function(err,rows){
                        rows.forEach(element => {
                            // On convertit le résultat en objet js
                            const prescription = new Prescription()
                            Object.assign(prescription, element[0][0])
                            //On complete l'objet prescription avec les Attributions et les conseils
                            prescription.setListAttributions(AttributionService.getListAttributionsByPrescriptionId(prescription.getIdPrescription()))
                            prescription.setListCouncils(CouncilService.getListCouncilsByPrescriptionId(prescription.getIdPrescription()))
                            listPrescriptionArchived.add(prescription)
                        });    
                    })
            if (!result2) throw 'Une erreur est survenue'
            connection.release()
            return listPrescriptionNoneArchived, listePrescriptionArchived
        }catch(e){ console.log(e)}     
    }

}

module.exports = PrescriptionServices