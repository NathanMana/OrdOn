var bcrypt = require('bcrypt');
/* GERE LES ROUTES DU PHARMACIEN */
/* "/pharmacien/"  */
const express = require('express');
const router = express.Router()
const Pharmacist = require('./../models/Pharmacist')
// const PharmacistServices = require('../services/PharmacistServices')

/**
 * Gère l'affichage de la page d'accueil du pharmacien
 */
 router.get('/', (req, res) => {
    res.render('Pharmacist/home')
})

/**
 * Gère l'affichage de la page profile du pharmacien
 */
 router.get('/profil', (req, res) => {
    res.render('Pharmacist/profil')
})

/**
 * Gère l'affichage de la page ordonnance archivé du pharmacien
 */
 router.get('/ordonnancearchive', (req, res) => {
    res.render('Pharmacist/ordonnancearchive')
})
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
 /*GetPatientByEmail(email) : function(assert) {
 }
 const password = "mypass123"
const saltRounds = 10

bcrypt.genSalt(saltRounds, function (err, salt) {
  if (err) {
    throw err
  } else {
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        throw err
      } if (await bcrypt.compare(passwordClair, passwordHashé){

        } else {
        console.log(hash)
        
      }
    })
  }
})*/
router.get('/connexion',  (res,req)=>{
    const email = req.body.email
    const password = req.body.password
    
    req.session.pharmacist = new Pharmacist()

    const result = Pharmacist.query({
        text: 'SELECT * FROM public."user" WHERE email=$1',
        values: [email]
    })
    if (result.rows.length === 0) {
        res.status(401).json({
          message: 'Pharmacist doesnt exist'
        })
        return
      }
    const user = result.rows[0]

    if (bcrypt.compare(password, user.password)) {
        // alors connecter l'utilisateur
        req.session.userId = user.id
        const jout = client.query({
          values: [user.id],
          rowMode: 'array'
        })
    }
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
        res.redirect('Pharmacist/home', { Pharmacist : req.session.pharmacist })
    }
})

module.exports = router