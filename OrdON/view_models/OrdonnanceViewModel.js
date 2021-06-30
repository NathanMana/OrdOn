/**
 * Permet de récupérer le nom du docteur pour une ordonnance donnée
 */

const { getDoctorById } = require("../services/DoctorServices")

class OrdonnanceViewModel {

/** 
 * id de la prescription
 */
#id_prescription


/**
 * id du docteur
 */
#id_doctor

/**
 * Nom du docteur
 */
#doctor_name

/**
 * Constructeur de la classe
 * @param {long} id_prescription
 * @param {long} id_doctor
 * @param {string} doctor_name
 */

constructor (id_prescription, id_doctor){
    this.#id_prescription = id_prescription
    this.id_doctor = id_doctor
    this.doctor_name = DoctorServices().getDoctorById(this.id_doctor)
}

getDoctorId(){return this.id_doctor}
getPrescriptionId(){return this.id_prescription}
getDoctorName(){return this.doctor_name}

}