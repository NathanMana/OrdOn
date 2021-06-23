/* GERE LES ROUTES DU PATIENT */
/* "/patient/"  */
const express = require('express');
const PatientServices = require('../services/PatientServices');
const router = express.Router()
const Patient = require('./../models/Patient')
// const PatientServices = require('../services/PatientServices')

/**
 * Traite l'inscription des patients
 * @method POST
 */
router.post('/inscription', (req, res) => {
    const name = req.body.name
    const firstName = req.body.firstName
    const email = req.body.email
    const password = req.body.password
    const password_check = req.body.password_check

    if (password == password_check) {
        const patient = new Patient(name, firstName, email, password)
        PatientServices.addPatient(patient)
        res.redirect('Patient/connectionPatient')
    }
    else {
        alert(`password dosen't matched`)
        res.render('Patient/registerPatient', { Patient : {
            name: name,
            firstName: firstName,
            email: email
        }})
    }
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
    res.render('Patient/profil')
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
    
    req.session.patient = new Patient()

    if (req.session.patient == null){
        if(PatientServices.check(email,password)){
            req.session.patient =  PatientServices.get(email, password)
            res.render('Patient/home', {Patient: req.session.patient })
        }
        if(!PatientServices.checkEmail(email)){
            alert('email incorrect')
            res.redirect('Patient/connectionPatient')
        }
        if (!PatientServices.checkPassword(password)){
            alert('mot de passe incorrect')
            res.redirect('Patient/connectionPatient')
        }

    }
    else{
        console.log('un patient est déjà connecté')
        res.redirect('Patient/home', { Patient : req.session.patient })
    }
})


module.exports = router