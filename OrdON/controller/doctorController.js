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
const DoctorServices = require('../services/DoctorServices')

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
router.post('/connexion',  (res,req)=>{
    const {email, password} = req.body
    if (!email || !password) {
        req.session.error = "Remplissez tous les champs"
        return res.redirect('/Doctor/registerDoctor')
    }

    // Récupérer l'objet
    const doctor = await DoctorServices.getDoctorByEmail(email)

    // Vérification mdp
    const verifPass = await bcrypt.compare(password, doctor.password)
    if (!verifPass) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/Doctor/registerDoctor')
    }

    req.session.user = {email: email}
    return res.redirect('/Doctor/home')
})

//Donne l'accès à la page de création d'ordonnance
router.get('/ordonnance/creer/:encyptedId_patient', (req,res)=>{
    
    res.render('Doctor/create_ordonnance')
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
router.post('/ordonnance/creer', (req, res)=>{
    const id_doctor = req.session.id_doctor;
    const id_patient = req.session.id_client;
    const today = new Date(Date.now());
    today.toLocaleString();
    const date_creation = today;

    const listCouncils = formatTipList(req.body.tipList);
    const listAttributions = formatAttributionList(req.body.attributionList);

    const prescription = new Prescription(id_doctor, id_patient, date_creation, listAttributions, listCouncils);
    id_prescription =  PrescriptionServices.addPrescription(prescription);
    for (let i = 0; i<listAttributions.length; i++){
        AttributionService.addAttribution(listAttributions[i])
    }

    //Rajouter les mentions attributions
    //1 - Modifier le constructeur de mention pour pouvoir récupérer l'id via le nom
    //2 - Grâce à MentionAttributionService ajouter les mentionsAttribution

})

module.exports = router