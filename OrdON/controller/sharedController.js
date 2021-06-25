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
/**
 * Gère l'affichage de la page de la connexion avec les 3 statuts
 */
router.get('/connexion', (req, res)=>{
    res.render('connectionPath')
})
/**
 * Gère l'affichage de la page de la connexion avec le formulaire 
 */
router.get('/pharmacist/connectionPharmacist', (req, res)=>{
    res.render('../views/Pharmacist/connectionPharmacist')
})
/**
 * Gère l'affichage de la page de la connexion avec le formulaire 
 */
router.get('/patient/connectionPatient', (req, res)=>{
    res.render('../views/Patient/connectionPatient')
})
/**
 * Gère l'affichage de la page de la connexion avec le formulaire 
 */
router.get('/doctor/connectionDoctor', (req, res)=>{
    res.render('../views/Doctor/connectionDoctor')
})


/**
 * Gère l'affichage de la page de l'inscription avec les 3 status 
 */


 router.get('/register',(req, res)=>{
    res.render('registerPath')
})
/**
 * Gère l'affichage de la page de la connexion avec le formulaire 
 */
 router.get('/pharmacist/registerPharmacist', (req, res)=>{
    res.render('../views/Pharmacist/registerPharmacist')
})
/**
 * Gère l'affichage de la page de la connexion avec le formulaire 
 */
router.get('/patient/registerPatient', (req, res)=>{
    res.render('../views/Patient/registerPatient')
})
/**
 * Gère l'affichage de la page de la connexion avec le formulaire 
 */
router.get('/doctor/registerDoctor', (req, res)=>{
    res.render('../views/Doctor/registerDoctor')
})
/**
 * Gère l'affichage de la page de l'inscription avec les 3 status 
 */
module.exports = router