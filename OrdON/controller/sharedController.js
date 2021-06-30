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
 router.get('/motdepasseoublie', (req, res) => {
    res.render('forgotPassword')
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
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router