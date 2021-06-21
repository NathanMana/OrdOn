/* GERE LES ROUTES PARTAGEES */
/* "/"  */
const express = require('express')
const router = express.Router()

/**
 * Gère l'affichage de la page d'accueil
 */
router.get('/', (req, res) => {
    res.render('index')
})

module.exports = router