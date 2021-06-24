/* GERE LES ROUTES DU PATIENT */
/* "/patient/"  */
const express = require('express');
const bcrypt = require('bcrypt')
const PatientServices = require('../services/PatientServices');
const router = express.Router()
const Patient = require('./../models/Patient')

/**
 * Traite l'inscription des patients
 * @method POST
 */
router.post('/inscription', async (req, res) => {
    const name = req.body.name
    const firstName = req.body.firstname
    const email = req.body.email
    const birthdate = req.body.birthdate
    const password = req.body.password
    const password_check = req.body.password_check

    if (!name || !firstName || !email || !birthdate || !password || !password_check ) return
    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        return
    }

    if (password !== password_check) {
        return res.render('Patient/registerPatient', { Patient : {
            name: name,
            firstName: firstName,
            email: email
        }})
    }

    // On essaie de transformer le string correspondant à la date de naissance en date
    let birthdateToAdd
    try {
        birthdateToAdd = new Date(birthdate)
    } catch(e){
        return
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const patient = new Patient(name, firstName, email, hashPassword, birthdateToAdd)
    PatientServices.addPatient(patient)
    return res.redirect('Patient/connectionPatient')
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