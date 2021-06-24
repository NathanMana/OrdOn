/* GERE LES ROUTES DU MEDECIN */
/* "/medecin/"  */
const express = require('express')
const router = express.Router()
const Doctor = require('./../models/Doctor')
// const DoctorServices = require('../services/DoctorServices')

/**
 * Traite l'inscription des médecins
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

    let doctorIsAlreadyRegistered = DoctorServices.check(name,firstName,email,password)

    if (!doctorIsAlreadyRegistered){
        res.redirect('Doctor/registerDoctor')
    }
    if (doctorIsAlreadyRegistered){
        DoctorServices.check(name,firstName,email,password, cabinetLocation, city, cabinetLocation, zipcode,typeProfesionnal)
        res.redirect('Doctor/registerDoctor')
    } 

})
/**
 * Gère l'affichage de la page d'accueil du docteur
 */
 router.get('/', (req, res) => {
    res.render('Doctor/home')
})

/**
 * Gère l'affichage de la page profile du docteur
 */
 router.get('/profil', (req, res) => {
    res.render('Doctor/profil')
})

/**
 * Traite la connexion des médecins
 * @method GET
 */
router.get('/connexion',  (res,req)=>{
    const email = req.body.email
    const password = req.body.password
    
    req.session.doctor = new Doctor()

    if (req.session.doctor == null){
        if(DoctorServices.check(email,password)){
            req.session.doctor =  DoctorServices.get(email, password)
            res.render('Doctor/home', { Doctor: req.session.doctor })
        }
        if(!DoctorServices.checkEmail(email)){
            alert('email incorrect')
            res.redirect('Doctor/connectionDoctor')
        }
        if (!DoctorServices.checkPassword(password)){
            alert('mot de passe incorrect')
            res.redirect('Doctor/connectionDoctor')
        }

    }
    else{
        console.log('un doctor est déjà connecté')
        res.redirect('Doctor/home', { Doctor : req.session.doctor })
    }
})


module.exports = router