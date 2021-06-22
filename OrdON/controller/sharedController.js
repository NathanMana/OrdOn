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

module.exports = router