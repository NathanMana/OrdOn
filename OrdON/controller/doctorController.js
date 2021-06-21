/* GERE LES ROUTES DU MEDECIN */
/* "/medecin/"  */
const express = require('express')
const router = express.Router()
const DoctorServices = require('../services/DoctorServices')

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

module.exports = router