/* GERE LES ROUTES DU MEDECIN */
/* "/medecin/"  */
const express = require('express')
const Council = require('../models/Council')
const Mention = require('../models/Mention')
const AttributionService = require('../services/AttributionService')
const PrescriptionServices = require('../services/PrescriptionServices')
const MentionServices = require('../services/MentionServices')
const router = express.Router()
const bcrypt = require('bcrypt')
const Doctor = require('./../models/Doctor')
const PatientServices = require('../services/PatientServices')
const Patient = require('../models/Patient')
// const DoctorServices = require('../services/DoctorServices')
const DoctorServices = require('../services/DoctorServices')
const MentionAttributionServices = require('../services/MentionAttributionServices')

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

    const today = new Date(Date.now());
    const date_creation = today.toLocaleString().substring(0,10);

    const mentions = await MentionServices.getAllMentions();
    console.log("mentions : " + mentions)

    res.render('Doctor/create_ordonnance', {PrescriptionObjects: {
        patient: patient.toObject(),
        doctor: req.session.doctor,
        madeDate: date_creation,
        mentions: mentions
        }
    });
})

function formatTipList(tipList){
    var councilList = new Array();
    for (let i=0; i<tipList.length; i++){
        const council = new Council(tipList[i]);
        councilList.push(council);
    }
    return councilList;
}

function formatAttributionList(attributionList){
    var attributionList = new Array();
    for (let i=0; i<attributionList.length; i++){
        const drug = new Drug(attributionList[i][0]);
        const description = attributionList[i][1];
        const quantity = attributionList[i][2];
        const mentions = attributionList[i][3];
        const mentionList = generateMentionList(mentions);
        const attribution = new Attribution(description, quantity, drug, mentionList);
        attributionList.push(attribution);
    }
    return attributionList;
}

function generateMentionList(mentions){
    var mentionList = new Array();
    for (let i=0; i<mentions.length; i++){
        const mention = new Mention(mentions[i]);
        mentionList.push(mention);
    }
    return mentionList;
}

//Créer l'ordonnance
router.post('/ordonnance/creer/:encryptedIdPatient', (req, res)=>{
    const id_doctor = req.session.encryptedIdDoctor;
    const id_patient = req.params.encryptedIdPatient;
    const today = new Date(Date.now());
    today.toLocaleString().substring(0,10);
    const date_creation = today;

    const data = JSON.parse(req.body.data) // ligne du saint graal

    const listCouncils = formatTipList(req.body.tipList);
    const listAttributions = formatAttributionList(req.body.attributionList);

    const prescription = new Prescription(id_doctor, id_patient, date_creation, listAttributions, listCouncils);
    prescription =  PrescriptionServices.addPrescription(prescription);
    id_prescription = prescription.getPrescriptionId();
    for (let i = 0; i<listAttributions.length; i++){
        listAttributions[i].setPrescriptionId(id_prescription)
        attribution = AttributionService.addAttribution(listAttributions[i])
        id_attribution = attribution.getAttributionId();

        //Récupérer mentions
        //Les ajouter à la table
        mentions = generateMentionList(listAttributions[i][3])
        for (let i = 0; i < mentions.length; i++){
            mentionId = MentionServices.getMentionIdByName(mentions[i])
            mentionAttrib = new MentionAttribution(id_attribution, mentionId)
            MentionAttributionServices.addMentionAttribution(mentionAttrib)
        }
    }

})

module.exports = router