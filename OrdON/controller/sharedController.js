/* GERE LES ROUTES PARTAGEES */
/* "/"  */
const express = require('express')
const router = express.Router()
const services = require('../services/TestServices.js')

/**
 * Gère l'affichage de la page d'accueil
 */
router.get('/', (req, res) => {
    // const testService = new services()
    // testService.createUser("Maxime")
    res.render('index')
})

module.exports = router