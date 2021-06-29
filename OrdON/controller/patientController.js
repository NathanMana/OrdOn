/* GERE LES ROUTES DU PATIENT */
/* "/patient/"  */
const express = require('express');
const bcrypt = require('bcrypt')
const PatientServices = require('../services/PatientServices');
const router = express.Router()
const Patient = require('./../models/Patient')
const QRcode = require('qrcode')

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
    const name = req.body.name
    const firstName = req.body.firstname
    const email = req.body.email
    const birthdate = req.body.birthdate
    const password = JSON.stringify(req.body.password)
    const password_check = JSON.stringify(req.body.password_check)
    const weight = req.body.weight
    
    if (!name || !firstName || !email || !birthdate || !password || !password_check ) {
        req.session.error = "Tous les champs n'ont pas été remplis"
        return res.redirect('/patient/inscription')
    }
    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        req.session.error = "Le mot de passe ne respecte pas tous les critères"
        return res.redirect('/patient/inscription')
    }

    if (password !== password_check) {
        req.session.error = "Les mots de passe ne correspondent pas"
        return res.render('/patient/inscription', { Patient : {
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
    const patient = new Patient(name, firstName, email, hashPassword, birthdateToAdd, weightDouble)
    PatientServices.addPatient(patient)
    return res.redirect('/patient/connexion')
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
 * @method GET
 */
 router.get('/connexion',  (res,req)=>{
    const email = req.body.email
    const password = req.body.password
    console.log('je suis la '+ req.body.encryptedId)
    if (req.session.encryptedId == null){
        
        if(!PatientServices.isEmailPresent(email)){
            alert('email incorrect')
            return res.redirect('/Patient/connectionPatient')
        }
        if (!PatientServices.isPasswordCorrect(password)){
            alert('mot de passe incorrect')
            return res.redirect('/Patient/connectionPatient')
        }
        req.session.encryptedId =  PatientServices.getPatientByEmail(email)
        console.log(req.session.encryptedId)
        return res.render('/Patient/home')

    }
    else{
        console.log('un patient est déjà connecté')
        return res.redirect('/Patient/home')
    }
})




module.exports = router