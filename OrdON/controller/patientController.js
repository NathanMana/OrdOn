/* GERE LES ROUTES DU PATIENT */
/* "/patient/"  */
const express = require('express');
const bcrypt = require('bcrypt')
const PatientServices = require('../services/PatientServices');
const router = express.Router()
const Patient = require('./../models/Patient')
const QRcode = require('qrcode')

const nodemailer = require('../externalsAPI/NodeMailer')

/**
 * Créer un locals utilisable en ejs
 */
 router.use((req, res, next) => {
    res.locals.user = req.session.user
    next()
})

/**
 * Affichage de la page de connexion d'un patient
 */
router.get('/connexion', (req, res)=>{
    res.render('Patient/connectionPatient')
})

/**
 * Affichage de la page inscription d'un patient
 */
router.get('/inscription', (req, res)=>{
    if (req.session.error) {
        res.locals.error = req.session.error
        req.session.error = undefined
    }
    res.render('Patient/registerPatient')
})

/**
 * Traite l'inscription des patients
 * @method POST
 */
router.post('/inscription', async (req, res) => {
    console.log('hello world')
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
        "<p>Veuillez cliquer sur le lien ci-contre pour valider votre inscription :</p><a href='http://localhost:8000/patient/email/verification/" + patient.getTokenEmail() + "'>Cliquer sur ce lien</a>" 
    )

    return res.redirect('/patient/email/verification/envoyee')
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
    const url = 'http://localhost:8000/docteur/ordonnance/creer/'+req.session.encryptedId


    QRcode.toDataURL(url, (err,qr) =>{
        if (err) res.send("error occurred")

        return res.render("Patient/profil", { ProfilObject: {
            qrcode : qr,
            user: req.session.patient
        } })
    })
})

/**
 * Gère l'affichage de la page profile du patient
 */
 router.get('/ordonnance', (req, res) => {
    res.render('Patient/ordonnance')
})

/**
 * Traite la connexion du patient
 * @method POST
 */
router.post('/connexion', async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        req.session.error = "Remplissez tous les champs"
        return res.redirect('/Patient/registerPatient')
    }

    // Récupérer l'objet
    const patient = await PatientServices.getPatientByEmail(email)

    // Vérification mdp
    const verifPass = await bcrypt.compare(password, patient.password)
    if (!verifPass) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/Patient/registerPatient')
    }

    req.session.user = {email: email}
    return res.redirect('/Patient/registerPatient')
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
        email: patient.getEmail(),
        name : patient.getName(),
        firstname : patient.getFirstname()
    }
    return res.redirect('/patient/')
})



module.exports = router