/* GERE LES ROUTES DU MEDECIN */
/* "/medecin/"  */
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const Council = require('../models/Council')
const Mention = require('../models/Mention')
const Attribution = require('../models/Attribution')
const Doctor = require('./../models/Doctor')
const Prescription = require('./../models/Prescription')
const Patient = require('../models/Patient')
const MentionAttribution = require('../models/AssociationClass/MentionAttribution')

const PrescriptionServices = require('../services/PrescriptionServices')
const MentionServices = require('../services/MentionServices')
const PatientServices = require('../services/PatientServices')
const DoctorServices = require('../services/DoctorServices')
const MentionAttributionServices = require('../services/MentionAttributionServices')
const DrugServices = require('../services/DrugServices')
const AttributionServices = require('../services/AttributionServices')
const CouncilServices = require('../services/CouncilServices')

router.get('/connexion', (req, res)=>{
    res.render('Doctor/connectionDoctor')
})

router.get('/inscription', (req, res)=>{
    res.render('Doctor/registerDoctor')
})
/**
 * Traite l'inscription des médecins
 * @method POST
 */
router.post('/inscription', async(req, res) => {
    const name = req.body.name
    const firstName = req.body.firstName
    const email = req.body.email
    const password = JSON.stringify(req.body.password)
    const city = req.body.city
    const address = req.body.address
    const cabinetLocation = req.body.cabinetLocation
    const zipcode = req.body.zipcode
    const typeProfesionnal = req.body.typeProfesionnal

    if (!name || !firstName || !email || !password || !city || !cabinetLocation
        || !zipcode || !typeProfesionnal) {
            req.session.error = "Tous les champs n'ont pas été remplis"
            return res.redirect('/docteur/inscription')
    }
    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        req.session.error = "Le mot de passe ne respecte pas tous les critères"
        return res.redirect('/docteur/inscription')
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const doctor = new Doctor(name, firstName, email, hashPassword, city, address, zipcode)
    doctor.setProfessionnalId(typeProfesionnal)
    DoctorServices.addDoctor(doctor)

    

})
/**
 * Gère l'affichage de la page d'accueil du docteur
 */
 router.get('/', (req, res) => {
    res.render('Doctor/home')
})

/**
 * Gère l'affichage de la page profile du docteur
 */
 router.get('/profil', (req, res) => {
    res.render('Doctor/profil')
})

/**
 * Traite la connexion des médecins
 * @method POST
 */
router.post('/connexion',  async (res,req)=>{
    const {email, password} = req.body
    if (!email || !password) {
        req.session.error = "Remplissez tous les champs"
        return res.redirect('/Doctor/registerDoctor')
    }

    // Récupérer l'objet
    const doctor = await DoctorServices.getDoctorByEmail(email)
    req.session.doctor = doctor;
    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), doctor.getPassword())
    if (!verifPass) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/Doctor/registerDoctor')
    }

    req.session.user = {encryptedId: doctor.getEncryptedId(), type: 'docteur'}
    return res.redirect('/doubleauthentification')
})

//Donne l'accès à la page de création d'ordonnance
router.get('/ordonnance/creer/:encryptedIdPatient', async (req,res)=>{
    const id_patient = req.params.encryptedIdPatient;
    const patient = await PatientServices.getPatientByEncryptedId(id_patient);
    if (!patient) {
        req.session.flash = {
            error : "Patient introuvable"
        }
        return res.redirect('/docteur/')
    }

    const today = new Date(Date.now());
    const date_creation = today.toLocaleString().substring(0,10);
    const mentions = await MentionServices.getAllMentions();
    const drugs = await DrugServices.getAllDrugs();
    const doctor = await DoctorServices.getDoctorByEncryptedId(req.session.user.encryptedId)
    if (!doctor) {
        req.session.flash = {
            error : "Une erreur est survenue"
        }
        req.session.user = undefined
        return res.redirect('/')
    }

    res.render('Doctor/create_ordonnance', {PrescriptionObjects: {
        patient: patient.toObject(),
        doctor: doctor,
        madeDate: date_creation,
        mentions: mentions,
        drugs: drugs
        }
    });
})

//Créer l'ordonnance
router.post('/ordonnance/creer/:encryptedIdPatient', async (req, res)=>{
    let id_doctor = req.session.encryptedId;
    let id_patient = req.params.encryptedIdPatient;

    const data = JSON.parse(req.body.data) // ligne du saint graal
    const listAttributionsJSON = data.attributionList
    const listCouncilsJSON = data.tipList
    if (listAttributionsJSON.length === 0 && listCouncilsJSON.length === 0) {
        return res.send({status: false, message: 'L\'ordonnance ne peut pas être vide'})
    }

    // On ajoute la prescription (pour avoir son id)
    // id_doctor = await DoctorServices.getDoctorIdByEncryptedId(id_doctor)
    id_patient = await PatientServices.getPatientIdByEncryptedId(id_patient) 
    // if (!id_doctor || id_doctor <= 0 || !id_patient || id_patient <= 0) 
    //     return res.send({status: false, message: 'Une erreur est survenue, déconnectez-vous et reconnectez-vous'})

    const prescriptionToAdd = new Prescription(1, id_patient)
    let prescription = await PrescriptionServices.addPrescription(prescriptionToAdd)
    if (!prescription) return res.send({status: false, message:"Impossible de créer l'ordonnance"})
    
    // On convertit le JSON en objet
    listAttributionsJSON.forEach(async (attributionJSON) => {
        // Récupérer l'id du médicament
        idDrug = await DrugServices.getDrugIdByName(attributionJSON.drug_name)
        if (!idDrug || idDrug <= 0) return res.send({status: false, message: attributionJSON.drug_name + "n'existe pas"})
        
        // Ajouter l'attribution
        let attribution = new Attribution(
            attributionJSON.attribution_desc,
            attributionJSON.attribution_quantity,
            idDrug,
            prescription.getPrescriptionId()
        )
        attribution = await AttributionServices.addAttribution(attribution)
        if (!attribution) return res.send({status: false, message:"Impossible d'ajouter la prescription concernant le médicament : " + attributionJSON.drug_name})

        // Tout d'abord convertir les mentions
        attributionJSON.attribution_mentions.forEach(async (mentionData) => {
            // Récupérer l'id de la mention par le biais de son nom
            idMention = await MentionServices.getMentionIdByName(mentionData)
            if (idMention) {
                MentionAttributionServices.addMentionAttribution(new MentionAttribution(attribution.getAttributionId(), idMention))
            }
        })    
    })

    listCouncilsJSON.forEach((councilData) => {
        CouncilServices.addCouncil(new Council(councilData, prescription.getPrescriptionId()))
    })

    res.send({status: true})
})


router.get('/ordonnance/envoyee', (req, res) => {
    res.render('Doctor/prescription_sent')
})

module.exports = router