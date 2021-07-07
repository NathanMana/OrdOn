/* GERE LES ROUTES DU MEDECIN */
/* "/medecin/"  */
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const nodemailer = require('../externalsAPI/NodeMailer');
var formidable = require('formidable');
var fs = require('fs');

const pathToProofFolder = require('../modules/pathToProofFolder');

const Council = require('../models/Council')
const Mention = require('../models/Mention')
const Patient = require('../models/Patient')
const Doctor = require('./../models/Doctor')
const Prescription = require('./../models/Prescription')
const Attribution = require('./../models/Attribution')
const MentionAttribution = require('./../models/AssociationClass/MentionAttribution')

const PatientServices = require('../services/PatientServices')
const DoctorServices = require('../services/DoctorServices')
const PrescriptionServices = require('../services/PrescriptionServices')
const MentionServices = require('../services/MentionServices')
const MentionAttributionServices = require('../services/MentionAttributionServices')
const DrugServices = require('../services/DrugServices')
const AttributionServices = require('../services/AttributionServices')
const CouncilServices = require('../services/CouncilServices')


router.get('/connexion', (req, res)=>{
    res.render('Doctor/connectionDoctor')
})

/**
 * Traite la connexion des médecins
 * @method POST
 */
 router.post('/connexion',  async (req, res)=>{
    const password = req.body.password
    const email = req.body.email
    if (!email || !password) {
        req.session.error = "Remplissez tous les champs"
        return res.redirect('/docteur/connexion')
    }

    // Récupérer l'objet
    const doctor = await DoctorServices.getDoctorByEmail(email)
    if (!doctor) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/docteur/connexion')
    }

    if (!doctor.getIsEmailVerified()) {
        req.session.error = "Vous n'avez pas vérifié votre email"
        return res.redirect('/docteur/connexion')
    }

    if (!doctor.getIsAccountValidated()) {
        req.session.error = "Votre compte est toujours en attente de validation par un modérateur"
        return res.redirect('/docteur/connexion')
    }
    
    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), doctor.getPassword())
    if (!verifPass) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/docteur/connexion')
    }

    req.session.user = {encryptedId: doctor.getEncryptedId(), type: 'docteur'}
    return res.redirect('/doubleauthentification')
})

router.get('/inscription', (req, res)=>{
    res.render('Doctor/registerDoctor')
})
/**
 * Traite l'inscription des médecins
 * @method POST
 */
router.post('/inscription', async(req, res) => {
    // Traitement du fichier
    let form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        const name = fields.name
        const firstName = fields.firstName
        const email = fields.email
        const password = JSON.stringify(fields.password)
        const city = fields.city
        const address = fields.address
        const zipcode = fields.zipcode
        const password_check = JSON.stringify(fields.password_check)
        const gender = fields.gender

        if (!name || !firstName || !email || !password || !city || !zipcode || !address || !password_check || !gender) {
            req.session.error = "Tous les champs n'ont pas été remplis"
            return res.redirect('/docteur/inscription')
        }
        if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
            req.session.error = "Le mot de passe ne respecte pas tous les critères"
            return res.redirect('/docteur/inscription')
        }
    
        if (password !== password_check) {
            req.session.error = "Les mots de passe ne correspondent pas"
            return res.redirect('/pharmacien/inscription')
        }
    
        // Vérifier si l'email est déjà utilisé
        if(await DoctorServices.isEmailPresent(email)) {
            req.session.error = "Cet email est déjà utilisé"
            return res.redirect('/docteur/inscription')
        }
       
        if (!files.fileUpload.name) {
            req.session.error = "La preuve de profession est obligatoire !"
            return res.redirect('/docteur/inscription')
        }
        var oldpath = files.fileUpload.path;
        var newpath = pathToProofFolder + files.fileUpload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
        });

        const hashPassword = await bcrypt.hash(password, 10)
        let doctor = new Doctor(name, firstName, email, hashPassword, city, address, zipcode, gender)
        doctor.setProofPath(files.fileUpload.name)
        doctor = await DoctorServices.addDoctor(doctor)
        
        // Envoyer l'email de confirmation
        nodemailer(
            email, 
            "Confirmation d'inscription à OrdON", 
            "Veuillez cliquer sur le lien ci-contre pour valider votre inscription : http://localhost:8000/docteur/email/verification/" + doctor.getTokenEmail(),
            "<p>Veuillez cliquer sur le lien ci-contre pour valider votre inscription :</p><a href='http://localhost:8000/docteur/email/verification/" + doctor.getTokenEmail()
        )
        return res.redirect('/email/verification/envoyee')
    }); 
})

/**
 * Traitement de la vérification d'un patient
 */
 router.get('/email/verification/:token', async (req, res) => {
    const token = req.params.token
    if (!token) return res.status(500).send("Une erreur est survenue")
 
    // Essayer de récupérer le patient correspondant
    const doctor = await DoctorServices.getDoctorByTokenEmail(token)
    if (!doctor) return res.status(500).send("Une erreur est survenue")
 
    // On peut certifier que l'email est vérifié
    doctor.setIsEmailVerified(true)
    doctor.setTokenEmail(null)
    DoctorServices.updateDoctor(doctor)

    req.session.flash = {
        success : "Votre email a été validé, vous devez attendre maintenant que votre compte soit validé par un modérateur. Un email vous sera envoyé pour confirmer votre inscription"
    }
    return res.redirect('/')
})

/**
 * Envoi l'email de réinitialisation de mot de passe
 */
 router.post('/motdepasseoublie', async (req, res) => {
    const email = req.body.email
    if (!email) {
        req.session.error = "Vous devez remplir l'email"
        res.redirect('/motdepasseoublie/docteur')
    } 

    // On cherche un patient avec cet email
    const doctor = await DoctorServices.getDoctorByEmail(email)
    if (!doctor) {
        req.session.error = "Cet email n'existe pas"
        res.redirect('/motdepasseoublie/docteur')
    }

    // On commence le setup pour envoyer le mail
    doctor.setTokenResetPassword(doctor.encryptId(doctor.getDoctorId()))
    DoctorServices.updateDoctor(doctor)

    nodemailer(
        doctor.getEmail(),
        "Réinitialisation de votre mot de passe",
        "Cliquez sur ce lien pour réinitialiser votre mot de passe : http://localhost:8000/docteur/reinitialisation/motdepasse/" + doctor.getTokenResetPassword(),
        "Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href='http://localhost:8000/docteur/reinitialisation/motdepasse/" + doctor.getTokenResetPassword() + "'>http://localhost:8000/docteur/reinitialisation/motdepasse/" + doctor.getTokenResetPassword() + "</a>"
    )

    return res.render('layouts/emailVerification.ejs')
})


/**
 * Formulaire réinitilsiation mot de passe
 */
 router.get('/reinitialisation/motdepasse/:token', async (req, res) => {
    const token = req.params.token
    if (!token) {
        return res.redirect('/')
    }

    // Trouver le patient
    const doctor = await DoctorServices.getDoctorByTokenResetPassword(token)
    if (!doctor) return res.redirect('/')

    res.render('reinitPassword', {patientId : doctor.getEncryptedId(), type: 'docteur'})
})

/**
 * Traitement réinitialisation mot de passe
 */
router.post('/reinitialisation/motdepasse/:token', async (req, res) => {
    const {encryptedId} = req.body
    const password = JSON.stringify(req.body.password)
    const check_password = JSON.stringify(req.body.check_password)
    const token = req.params.token
    if (!token) return res.redirect('/')
    if (!password || !check_password || !encryptedId) {
        req.session.error = "Tous les champs n'ont pas été renseignés"
        return res.redirect('/docteur/reinitialisation/motdepasse/' + token)
    }

    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        req.session.error = "Le mot de passe ne respecte pas tous les critères"
        return res.redirect('/docteur/inscription')
    }
    if (password !== check_password) {
        req.session.error = "Les mots de passe ne correspondent pas"
        return res.redirect('/docteur/reinitialisation/motdepasse/' + token)
    }

    const doctor = await DoctorServices.getDoctorByTokenResetPassword(token)
    if (!doctor) return res.redirect('/docteur/reinitialisation/motdepasse/' + token)

    const hashPassword = await bcrypt.hash(password, 10)
    doctor.setPassword(hashPassword)
    doctor.setTokenResetPassword(null)
    DoctorServices.updateDoctor(doctor)

    // On le connecte directement
    req.session.user = {encryptedId: doctor.getEncryptedId(), type: 'docteur'}
    req.session.flash = {
        success : "Réinitialisation du mot de passe effectuée avec succès !"
    }
    return res.redirect('/docteur/')
})

/**
 * Vérifie les droits d'accès a chaque requête
 */
 router.use((req, res, next) => {
    if (typeof req.session.user === 'undefined' || !req.session.user || req.session.user.type != "docteur") {
        req.session.desiredUrl = req.originalUrl
        return res.redirect("/docteur/connexion")
    }
    if (!req.session.user.isValidated){
        req.session.desiredUrl = req.originalUrl
        return res.redirect("/docteur/connexion")
    } 
    next()
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
 router.get('/profil', async (req, res) => {
    const doctor = await DoctorServices.getDoctorByEncryptedId(req.session.user.encryptedId)
    res.render('Doctor/profil', { profil : doctor.toObject()})
})

function entierAleatoire(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Donne l'accès à la page de création d'ordonnance
router.get('/ordonnance/creer/:qrCodeAccess', async (req,res)=>{
    const qrCodeAccess= req.params.qrCodeAccess;
    const patient = await PatientServices.getPatientByQRCodeAccess(qrCodeAccess);
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

    res.render(
        'Doctor/create_ordonnance', 
        {
            PrescriptionObjects: {
                patient: patient.toObject(),
                doctor: doctor.toObject(),
                madeDate: date_creation,
                mentions: mentions,
                drugs : drugs
            }
    });
})

//Créer l'ordonnance
router.post('/ordonnance/creer/:encryptedIdPatient', async (req, res)=>{
    let id_doctor = req.session.user.encryptedId;
    let id_patient = req.params.encryptedIdPatient;

    const data = JSON.parse(req.body.data) // ligne du saint graal
    const listAttributionsJSON = data.attributionList
    const listCouncilsJSON = data.tipList
    if (listAttributionsJSON.length === 0 && listCouncilsJSON.length === 0) {
        return res.send({status: false, message: 'L\'ordonnance ne peut pas être vide'})
    }

    // On ajoute la prescription (pour avoir son id)
    const doctor = await DoctorServices.getDoctorByEncryptedId(id_doctor)
    const patient = await PatientServices.getPatientByEncryptedId(id_patient) 
    if (!doctor || !patient) 
        return res.send({status: false, message: 'Une erreur est survenue, déconnectez-vous et reconnectez-vous'})

    const prescriptionToAdd = new Prescription(doctor.getDoctorId(), patient.getPatientId())
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

router.post('/profil', async (req, res) => {
    const firstname = req.body.firstname
    const name = req.body.name
    const city = req.body.city
    const email = req.body.email
    const gender = req.body.gender

    if (!firstname || !name || !city || !email || !gender) {
        req.session.error = "Tous les champs n'ont pas été renseignés"
        return res.redirect('/docteur/profil/')
    }

    let doctor = await DoctorServices.getDoctorByEncryptedId(req.session.user.encryptedId)
    doctor.setFirstname(firstname)
    doctor.setName(name)
    doctor.setEmail(email)
    doctor.setGender(gender)
    doctor.setCity(city)
    DoctorServices.updateDoctor(doctor)
    return res.redirect('/docteur/profil/')

})


router.get('/ordonnance/envoyee', (req, res) => {
    res.render('Doctor/prescription_sent')
})

/**
 * Gère la suppression du compte
 */
 router.post('/profil/supprimermoncompte', async (req, res) => {
    const {password} = req.body
    if (!password) {
        req.session.error = "Tous les champs n'ont pas été remplis"
        return res.redirect('/profil/supprimermoncompte')
    }

    // Récupérer la patient
    const doctor = await DoctorServices.getDoctorByEncryptedId(req.session.user.encryptedId)
    if (!doctor) {
        return res.redirect('/deconnexion')
    }

    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), doctor.getPassword())
    if (!verifPass) {
        req.session.error = "Mot de passe incorrect"
        return res.redirect('/profil/supprimermoncompte')
    }

    DoctorServices.deleteDoctor(doctor)
    req.session.user = undefined
    req.session.flash = {
        success : "Compte bien supprimé ! L'équipe OrdON vous souhaite une bonne journée !"
    }
    res.redirect('/')
})


/**
 * Gère la suppression du compte
 */
 router.post('/profil/supprimermoncompte', async (req, res) => {
    const {password} = req.body
    if (!password) {
        req.session.error = "Tous les champs n'ont pas été remplis"
        return res.redirect('/profil/supprimermoncompte')
    }

    // Récupérer la patient
    const patient = await DoctorServices.getDoctorByEncryptedId(req.session.user.encryptedId)
    if (!patient) {
        return res.redirect('/deconnexion')
    }

    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), patient.getPassword())
    if (!verifPass) {
        req.session.error = "Mot de passe incorrect"
        return res.redirect('/profil/supprimermoncompte')
    }

    await DoctorServices.deleteDoctor(patient)
    req.session.user = undefined
    req.session.flash = {
        success : "Compte bien supprimé ! L'équipe OrdON vous souhaite une bonne journée !"
    }
    res.redirect('/')
})


module.exports = router