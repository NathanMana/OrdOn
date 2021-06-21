/* GERE LES ROUTES DU PATIENT */
/* "/patient/"  */
const express = require('express');
const router = express.Router()
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
        let patientIsAlreadyRegistered = PatientServices.check(name,firstName,email,password)

        if (!patientIsAlreadyRegistered){
            res.redirect('Patient/registerPatient')
        }
        if (patientIsAlreadyRegistered){
            PatientServices.create(name,firstName,email,password)
            res.redirect('Patient/loginPatient')
        } 
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
 * Gère l'affichage de la page d'accueil
 */
 router.get('/', (req, res) => {
    res.render('Patient/home')
})
module.exports = router