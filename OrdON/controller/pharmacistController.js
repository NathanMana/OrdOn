/* GERE LES ROUTES DU PHARMACIEN */
/* "/pharmacien/"  */
const express = require('express');
const router = express.Router()
// const PharmacistServices = require('../services/PharmacistServices')

/**
 * Traite l'inscription des pharmaciens
 * @method POST
 */
router.post('/inscription', (req, res) => {
    const name = req.body.name
    const firstName = req.body.firstName
    const email = req.body.email
    const password = req.body.password
    const city = req.body.city
    const cabinetLocation = req.body.cabinetLocation
    const zipcode = req.body.zipcode
    const typeProfesionnal = req.body.typeProfesionnal

    let pharmacistIsAlreadyRegistered = PharmacistServices.check(name,firstName,email,password)

    if (!pharmacistIsAlreadyRegistered){
        res.redirect('Pharmacist/registerPharmacist')
    }
    if (pharmacistIsAlreadyRegistered){
        PharmacistServices.check(name,firstName,email,password, city, cabinetLocation, zipcode,typeProfesionnal)
        res.redirect('Pharmacist/registerPharmacist')
    } 

})

module.exports = router