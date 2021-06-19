const express = require('express');
const router = express.Router()


router.post('/registerPatient', (req, res) => {
    name = req.body.name
    firstName = req.body.firstName
    email = req.body.email
    password = req.body.password

    let isAlreadyRegistered = PatientServices.check(name,firstName,email,password)

    if (!isAlreadyRegistered){
        res.redirect('Patient/registerPatient')
    }
    if (isAlreadyRegistered){
        PatientServices.create(name,firstName,email,password)
        res.redirect('Patient/loginPatient')
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

    let isAlreadyRegistered = DoctorServices.check(name,firstName,email,password)

    if (!isAlreadyRegistered){
        res.redirect('Doctor/registerDoctor')
    }
    if (isAlreadyRegistered){
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

    let isAlreadyRegistered = PharmacistServices.check(name,firstName,email,password)

    if (!isAlreadyRegistered){
        res.redirect('Pharmacist/registerPharmacist')
    }
    if (isAlreadyRegistered){
        PharmacistServices.check(name,firstName,email,password, city, cabinetLocation, zipcode,typeProfesionnal)
        res.redirect('Pharmacist/registerPharmacist')
    } 

})