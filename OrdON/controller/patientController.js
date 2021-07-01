/* GERE LES ROUTES DU PATIENT */
/* "/patient/"  */
const express = require('express');
const bcrypt = require('bcrypt')
const PatientServices = require('../services/PatientServices');
const router = express.Router()
const Patient = require('./../models/Patient')
const QRcode = require('qrcode')
 
const nodemailer = require('../externalsAPI/NodeMailer');
const PrescriptionServices = require('../services/PrescriptionServices');
 
/**
 * Affichage de la page de connexion d'un patient
 */
router.get('/connexion', (req, res)=>{
    res.render('Patient/connectionPatient')
})
 function entierAleatoire(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    //Utilisation
    //La variable contient un nombre aléatoire compris entre 1 et 10
/**
 * Traite la connexion du patient
 * @method POST
 */
 router.post('/connexion', async (req, res) => {
    const password= req.body.password
    const email = req.body.email
    if (!email || !password) {
        req.session.error = "Remplissez tous les champs"
        return res.redirect('/patient/connexion')
    }
 
    // Récupérer l'objet
    const patient = await PatientServices.getPatientByEmail(email)
    if (!patient) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/patient/connexion')
    }

    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), patient.getPassword())
    if (!verifPass) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/patient/connexion')
    }

    req.session.user = {
        encryptedId: patient.getEncryptedId(),
        type: 'patient',
        isValidated: false,
        entier : entierAleatoire(100000,199999)
    } // on ne met pas le type, car on est pas sur que le mec se connecte a 100% 
    nodemailer(patient.getEmail(),'votre code est '+req.session.user.entier,'votre code est '+req.session.user.entier,'votre code est '+req.session.user.entier)
    return res.redirect('/doubleauthentification')
})
 
/**
 * Affichage de la page inscription d'un patient
 */
router.get('/inscription', (req, res)=>{
    res.render('Patient/registerPatient')
})
 
/**
 * Traite l'inscription des patients
 * @method POST
 */
router.post('/inscription', async (req, res) => {
    const name = req.body.name
    const firstName = req.body.firstname
    const email = req.body.email
    const birthdate = req.body.birthdate
    const password = JSON.stringify(req.body.password)
    const password_check = JSON.stringify(req.body.password_check)
    const weight = req.body.weight
    const gender = req.body.gender
    if (!name || !firstName || !email || !birthdate || !password || !password_check || !gender) {
        req.session.error = "Tous les champs n'ont pas été remplis"
        return res.redirect('/patient/inscription')
    }
    const genderList = ['femme', 'homme', 'neutre']
    if (!genderList.find(c => c === gender)) {
        req.session.error = "Ce genre n'est pas accepté"
        return res.redirect('/patient/inscription')
    }
    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        req.session.error = "Le mot de passe ne respecte pas tous les critères"
        return res.redirect('/patient/inscription')
    }
    if (password !== password_check) {
        req.session.error = "Les mots de passe ne correspondent pas"
        return res.redirect('/patient/inscription', { Patient : {
            name: name,
            firstName: firstName,
            email: email
        }})
    }
 
    // Vérifier si l'email est déjà utilisé
    if(await PatientServices.isEmailPresent(email)) {
        req.session.error = "Cet email est déjà utilisé"
        return res.redirect('/patient/inscription')
    }
 
    // On essaie de transformer le string correspondant à la date de naissance en date
    let birthdateToAdd
    try {
        birthdateToAdd = new Date(birthdate)
    } catch(e){
        req.session.error = "Le format de la date ne convient pas"
        return res.redirect('/patient/inscription')
    }
 
    // On essaie de transformer le string correspondant au poids en double
    let weightDouble = 0
    if (weight) {
        weightDouble = parseFloat(weight)
        if (isNaN(weightDouble)) {
            req.session.error = "Le format du poids ne convient pas"
            return res.redirect('/patient/inscription')
        }
    }
 
    const hashPassword = await bcrypt.hash(password, 10)
    let patient = new Patient(name, firstName, email, hashPassword, birthdateToAdd, gender, weightDouble)
    patient = await PatientServices.addPatient(patient)
    // Envoyer l'email de confirmation
    nodemailer(
        email, 
        "Confirmation d'inscription à OrdON", 
        "Veuillez cliquer sur le lien ci-contre pour valider votre inscription : http://localhost:8000/patient/email/verification/" + patient.getTokenEmail(),
        "<p>Veuillez cliquer sur le lien ci-contre pour valider votre inscription :</p><a href='http://localhost:8000/patient/email/verification/" + patient.getTokenEmail()
    )
 
    return res.redirect('/patient/email/verification/envoyee')
})

/**
 * Envoi l'email de réinitialisation de mot de passe
 */
router.post('/motdepasseoublie', async (req, res) => {
    const email = req.body.email
    if (!email) {
        req.session.error = "Vous devez remplir l'email"
        res.redirect('/motdepasseoublie/patient')
    } 

    // On cherche un patient avec cet email
    const patient = await PatientServices.getPatientByEmail(email)
    if (!patient) {
        req.session.error = "Cet email n'existe pas"
        res.redirect('/motdepasseoublie/patient')
    }

    // On commence le setup pour envoyer le mail
    patient.setTokenResetPassword(patient.getEncryptedId() + patient.encryptId(patient.getPatientId()))
    PatientServices.updatePatient(patient)

    nodemailer(
        patient.getEmail(),
        "Réinitialisation de votre mot de passe",
        "Cliquez sur ce lien pour réinitialiser votre mot de passe : http://localhost:8000/patient/reinitialisation/motdepasse/" + patient.getTokenResetPassword(),
        "Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href='http://localhost:8000/patient/reinitialisation/motdepasse/" + patient.getTokenResetPassword() + "'>http://localhost:8000/patient/reinitialisation/motdepasse/" + patient.getTokenResetPassword() + "</a>"
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
    const patient = await PatientServices.getPatientByTokenResetPassword(token)
    if (!patient) return res.redirect('/')

    res.render('reinitPassword', {patientId : patient.getEncryptedId(), type: 'patient'})
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
        return redirect('/reinitialisation/motdepasse/' + token)
    }

    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        req.session.error = "Le mot de passe ne respecte pas tous les critères"
        return res.redirect('/patient/inscription')
    }
    if (password !== check_password) {
        req.session.error = "Les mots de passe ne correspondent pas"
        return redirect('/reinitialisation/motdepasse/' + token)
    }

    const patient = await PatientServices.getPatientByTokenResetPassword(token)
    if (!patient) return redirect('/reinitialisation/motdepasse/' + token)

    const hashPassword = await bcrypt.hash(password, 10)
    patient.setPassword(hashPassword)
    patient.setTokenResetPassword(null)
    PatientServices.updatePatient(patient)

    // On le connecte directement
    req.session.user = {encryptedId: patient.getEncryptedId(), type: 'patient'}
    req.session.flash = {
        success : "Réinitialisation du mot de passe effectuée avec succès !"
    }
    return res.redirect('/patient/')
})
 
/**
 * Vérifie les droits d'accès a chaque requête
 */
 router.use((req, res, next) => {
    if (typeof req.session.user === 'undefined' || !req.session.user) {
        return res.redirect("/patient/connexion")
    }
    // if (!req.session.user.isValidated) return res.redirect("/patient/connexion")
    next()
})
 
/**
 * Gère l'affichage de la page d'accueil du patient
 */
router.get('/', (req, res) => {
    res.render('Patient/home')
})
 
/**
 * Gère l'affichage de la page profile du patient
 */
 router.get('/profil', (req, res) => {
    const url = 'http://localhost:8000/docteur/ordonnance/creer/'+req.session.user.encryptedId
    const patient = PatientServices.getPatientByEncryptedId(req.session.encryptedId)
 
    QRcode.toDataURL(url, (err,qr) =>{
        if (err) res.send("error occurred")
 
        return res.render("Patient/profil", { ProfilObject: {
            qrcode : qr,
            user: patient
        } })
    })
})
 

/**
 * Génère le qr code d'un ordonnance
 */
 router.get('/getordonnance', (req, res)=>{
    const ordo_id = req.body.id_prescription
 
    const url = 'http://localhost:8000/pharmacien/ordonnance/'+ordo_id
    
    QRcode.toDataURL(url, (err, qr) => {
        if (err) res.send('error occurred')
 
        return res.send(qr) 
    })
})
 
/**
 * Gère l'affichage de la page profile du patient
 */
 router.get('/ordonnances', (req, res) => {
    const prescriptions = PrescriptionServices.displayPrescriptionPatient(req.session.user.encryptedId)
    ordoViewModels = new Array()
    for (let i=0; i<prescriptions.length; i++){
        ordoViewModels.push(new OrdonnanceViewModel(prescriptions[i].getPrescriptionId(), prescriptions[i].getDoctorId))
    }

    res.render('Patient/ordonnances', {OrdonnancesObjects: {
            Prescriptions: prescriptions,
            OrdonnancesViewModels: ordoViewModels
            
        }
    })
})


/**
 * View indiquant de suivre les indications envoyées dans le mail
 */
router.get('/email/verification/envoyee', (req, res) => {
    return res.render('layouts/emailVerification.ejs')
})
 
/**
 * Traitement de la vérification d'un patient
 */
router.get('/email/verification/:token', async (req, res) => {
    const token = req.params.token
    if (!token) return res.status(500).send("Une erreur est survenue")
 
    // Essayer de récupérer le patient correspondant
    const patient = await PatientServices.getPatientByTokenEmail(token)
    if (!patient) return res.status(500).send("Une erreur est survenue")
 
    // On peut certifier que l'email est vérifié
    patient.setIsEmailVerified(true)
    patient.setTokenEmail(null)
    PatientServices.updatePatient(patient)
    
    // On considère que ca le connecte directement
    req.session.user = {
        type : "patient",
        encryptedId: patient.getEncryptedId()
    }

    req.session.flash = {
        sucess : "Compte bien validé :)"
    }
    return res.redirect('/patient/')
})



module.exports = router