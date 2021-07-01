/* GERE LES ROUTES PARTAGEES */
/* "/"  */
const express = require('express')
const router = express.Router()
const Patient = require('../models/Patient')
const PatientServices = require('../services/PatientServices')
/**
 * Gère l'affichage de la page d'accueil
 */
router.get('/', (req, res) => {
    res.render('index')
})

router.get('/faq', (req, res) => {
    res.render('faq')
})

router.get('/connexion', (req, res)=>{
    res.render('connectionPath')
})

router.get('/inscription', (req, res)=>{
    res.render('registerPath')
})

/**
 * Gère l'affichage de la page de modification d'email
 */
 router.get('/profil/modifieremail', (req, res) => {
    res.render('Profile/modifyMail')
})

/**
 * Gère l'affichage de la page de modification du mot de passe
 */
 router.get('/profil/modifiermotdepasse', (req, res) => {
    res.render('Profile/modifyPassword')
})

/**
 * Gère l'affichage de la page de suppression de compte
 */
 router.get('/profil/supprimermoncompte', (req, res) => {
    res.render('Profile/deleteAccount')
})
/**
 * Gère l'affichage de la page de l'oublie du mot de passe
 */
router.get('/motdepasseoublie/:typeUser', (req, res) => {
    const type = req.params.typeUser
    const list = ["patient", "pharmacien", "docteur"]
    if (!list.find(c => c === type)) return res.redirect('/')
    res.render('forgotPassword', {type})
})


/**
 * Gère l'affichage de la page de double authentification
 */
 router.get('/doubleauthentification', (req, res) => {
    res.render('doubleAuth')
})

/**
 * Deconnecte n'importe quel utilisateur
 */
router.get('/deconnexion', (req, res) => {
    req.session.flash = {
        success : "Merci et à la prochaine !"
    }
    req.session.user = undefined
    res.redirect('/')
})



router.post('/doubleauthentification', async (req, res) => {
    const password= req.body
    if (!req.session.user.type){
        res.render('index')
    }
    if (!password) {
        req.session.error = "Remplis bien le champ"
        return res.redirect('/'+req.session.user.type+'/doubleauthentification')
    }
 
    // Récupérer l'objet
    const patient = await PatientServices.getPatientByEmail(email)
    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), patient.getPassword())
    if (!verifPass) {
        req.session.error = "le code est incorect"
        return res.redirect('/'+req.session.user.type+'/doubleauthentification')
    }

    req.session.user = {encryptedId: patient.getEncryptedId(), type: 'patient'}
    return res.redirect('/patient/')
})
module.exports = router