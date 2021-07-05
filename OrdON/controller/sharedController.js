/* GERE LES ROUTES PARTAGEES */
/* "/"  */
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const nodemailer = require('../externalsAPI/NodeMailer');
const Patient = require('../models/Patient')
const PatientServices = require('../services/PatientServices')
const DoctorServices = require('../services/DoctorServices')
const PharmacistServices = require('../services/PharmacistServices')
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
 router.get('/doubleauthentification', async (req, res) => {
    function entierAleatoire(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    if(!req.session.user)
        return res.redirect('/')
    req.session.user.entier = entierAleatoire(100000,199999)
    let person
    if(req.session.user.type === "patient")
        person  = await PatientServices.getPatientByEncryptedId(req.session.user.encryptedId)
    if(req.session.user.type === "docteur")
        person  = await DoctorServices.getDoctorByEncryptedId(req.session.user.encryptedId)
    if (req.session.user.type === 'pharmacien')
        person  = await PharmacistServices.getPharmacistByEncryptedId(req.session.user.encryptedId)
    nodemailer(person.getEmail(),'Votre  code est '+req.session.user.entier,'votre code est '+req.session.user.entier,'votre code est '+req.session.user.entier)
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


/**
 * View indiquant de suivre les indications envoyées dans le mail
 */
 router.get('/email/verification/envoyee', (req, res) => {
    return res.render('layouts/emailVerification.ejs')
})
 

router.post('/doubleauthentification', async (req, res) => {
    const code= req.body.code
    if (!code) {
        req.session.error = "Remplis bien le champ"
        return res.redirect('/doubleauthentification')
    }
    if (!req.session.user || !req.session.user.entier)
    {
        req.session.error = "Une erreur est survenue"
        return res.redirect('/')
    }
    // Vérification code
    if (code != req.session.user.entier)
    {
        req.session.error = "ce n'est pas le bon code"
        return res.redirect('/doubleauthentification')
    }

    req.session.user.isValidated = true

    // S'il voulait accéder un endroit particulier, on lui retourne l'url voulue
    if (req.session.desiredUrl) {
        const url = req.session.desiredUrl
        req.session.desiredUrl = undefined
        return res.redirect(url)
    }

    if(req.session.user.type === "patient")
        return res.redirect('/patient/')
    if(req.session.user.type === "docteur")
        return res.redirect('/docteur/')
    if (req.session.user.type === 'pharmacien')
        return res.redirect('/pharmacien/')
    
    req.session.user = undefined
    res.redirect('/')
})
module.exports = router