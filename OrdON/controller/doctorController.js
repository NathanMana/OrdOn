/* GERE LES ROUTES DU MEDECIN */
/* "/medecin/"  */
const express = require('express')
const Council = require('../models/Council')
const Mention = require('../models/Mention')
const AttributionService = require('../services/AttributionService')
const PrescriptionServices = require('../services/PrescriptionServices')
const MentionServices = require('../services/MentionService')
const router = express.Router()
const Doctor = require('./../models/Doctor')
const PatientServices = require('../services/PatientServices')
// const DoctorServices = require('../services/DoctorServices')

/**
 * Traite l'inscription des médecins
 * @method POST
 */
router.post('/inscription', (req, res) => {
    const name = req.body.name
    const firstName = req.body.firstName
    const email = req.body.email
    const password = req.body.password
    const city = req.body.city
    const cabinetLocation = req.body.cabinetLocation
    const zipcode = req.body.zipcode
    const typeProfesionnal = req.body.typeProfesionnal

    let doctorIsAlreadyRegistered = DoctorServices.check(name,firstName,email,password)

    if (!doctorIsAlreadyRegistered){
        res.redirect('Doctor/registerDoctor')
    }
    if (doctorIsAlreadyRegistered){
        DoctorServices.check(name,firstName,email,password, cabinetLocation, city, cabinetLocation, zipcode,typeProfesionnal)
        res.redirect('Doctor/registerDoctor')
    } 

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
 * @method GET
 */
router.get('/connexion',  (res,req)=>{
    const email = req.body.email
    const password = req.body.password
    
    req.session.doctor = new Doctor()

    if (req.session.doctor == null){
        if(DoctorServices.check(email,password)){
            req.session.doctor =  DoctorServices.get(email, password)
            res.render('Doctor/home', { Doctor: req.session.doctor })
        }
        if(!DoctorServices.checkEmail(email)){
            alert('email incorrect')
            res.redirect('Doctor/connectionDoctor')
        }
        if (!DoctorServices.checkPassword(password)){
            alert('mot de passe incorrect')
            res.redirect('Doctor/connectionDoctor')
        }

    }
    else{
        console.log('un doctor est déjà connecté')
        res.redirect('Doctor/home', { Doctor : req.session.doctor })
    }
})

//Donne l'accès à la page de création d'ordonnance
router.get('/ordonnance/creer', (req,res)=>{
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