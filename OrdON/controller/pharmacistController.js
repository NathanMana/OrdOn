/* GERE LES ROUTES DU PHARMACIEN */
/* "/pharmacien/"  */
const express = require('express');
const router = express.Router()
const Pharmacist = require('./../models/Pharmacist')
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

/**
 * Traite la connexion des pharmaciens
 * @method GET
 */
router.get('/connexion',  (res,req)=>{
    const email = req.body.email
    const password = req.body.password
    
    req.session.pharmacist = new Pharmaciist()

    if (req.session.pharmacist == null){
        if(PharmacistServices.check(email,password)){
            req.session.pharmacist =  PharmacistServices.get(email, password)
            res.render('Pharmacist/home', { Pharmacist: req.session.pharmacist })
        }
        if(!PharmacistServices.checkEmail(email)){
            alert('email incorrect')
            res.redirect('Pharmacist/connectionPharmacist')
        }
        if (!PharmacistServices.checkPassword(password)){
            alert('mot de passe incorrect')
            res.redirect('Pharmacist/connectionPharmacist')
        }

    }
    else{
        console.log('un pharmacien est déjà connecté')
        res.redirect('Pharmacist/home', { Pharmaciist : req.session.pharmacist })
    }
})

module.exports = router