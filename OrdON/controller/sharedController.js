/* GERE LES ROUTES PARTAGEES */
/* "/"  */
const express = require('express')
const router = express.Router()
const Patient = require('../models/Patient')
const PatientServices = require('../services/PatientServices')
/**
 * Gère l'affichage de la page d'accueil
 */
router.get('/', async (req, res) => {
    res.render('index')
})

router.get('/faq', (req, res) => {
    res.render('faq')
})

router.get('/connexion', (req, res)=>{
    res.render('connectionPath')
})

router.get('/pharmacien', (req, res)=>{
    res.render('../views/Pharmacist/connectionPharmacist')
})

router.get('/patient', (req, res)=>{
    res.render('connectionPath')
})

router.get('/docteur', (req, res)=>{
    res.render('connectionPath')
})
module.exports = router