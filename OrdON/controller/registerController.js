const express = require('express');
const router = express.Router()
const PatientServices = require('../services/PatientServices')


router.post('/registerPatient', (req, res) => {
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



router.post('/registerDoctor', (req, res) => {
    name = req.body.name
    firstName = req.body.firstName
    email = req.body.email
    password = req.body.password
    city = req.body.city
    cabinetLocation = req.body.cabinetLocation
    zipcode = req.body.zipcode
    typeProfesionnal = req.body.typeProfesionnal

    let doctorIsAlreadyRegistered = DoctorServices.check(name,firstName,email,password)

    if (!doctorIsAlreadyRegistered){
        res.redirect('Doctor/registerDoctor')
    }
    if (doctorIsAlreadyRegistered){
        DoctorServices.check(name,firstName,email,password, cabinetLocation, city, cabinetLocation, zipcode,typeProfesionnal)
        res.redirect('Doctor/registerDoctor')
    } 

})


router.post('/registerPharmacist', (req, res) => {
    name = req.body.name
    firstName = req.body.firstName
    email = req.body.email
    password = req.body.password
    city = req.body.city
    cabinetLocation = req.body.cabinetLocation
    zipcode = req.body.zipcode
    typeProfesionnal = req.body.typeProfesionnal

    let pharmacistIsAlreadyRegistered = PharmacistServices.check(name,firstName,email,password)

    if (!pharmacistIsAlreadyRegistered){
        res.redirect('Pharmacist/registerPharmacist')
    }
    if (pharmacistIsAlreadyRegistered){
        PharmacistServices.check(name,firstName,email,password, city, cabinetLocation, zipcode,typeProfesionnal)
        res.redirect('Pharmacist/registerPharmacist')
    } 

})