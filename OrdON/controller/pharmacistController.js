/* GERE LES ROUTES DU PHARMACIEN */
/* "/pharmacien/"  */
const express = require('express');
const router = express.Router()
const bcyrpt = require('bcrypt')
const Pharmacist = require('./../models/Pharmacist')
const PharmacistServices = require('../services/PharmacistServices')
const Prescription = require('./../models/Prescription')
const PrescriptionService = require('./../services/PrescriptionServices')

router.get('/connexion', (req, res)=>{
    res.render('Pharmacist/connectionPharmacist')
})

router.get('/inscription', (req, res)=>{
    res.render('Pharmacist/registerPharmacist')
})
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
 router.get('/ordonnancesarchivees', (req, res) => {
    res.render('Pharmacist/ordonnanceArchive')
})

/**
 * Gère l'affichage de la page ordonnance scanné par le médecin
 */
 router.get('/ordonnancepatient', (req, res) => {
    res.render('Pharmacist/viewOrdonnance')
})
/**
 * Traite l'inscription des pharmaciens
 * @method POST
 */
router.post('/inscription', async (req, res) => {
    const name = req.body.name
    const firstName = req.body.firstName
    const email = req.body.email
    const password = req.body.password
    const city = req.body.city
    const address = req.body.address
    const cabinetLocation = req.body.cabinetLocation
    const zipcode = req.body.zipcode
    const typeProfesionnal = req.body.typeProfesionnal

    if (!name || !firstName || !email || !password || !city || !cabinetLocation
        || !zipcode || !typeProfesionnal) {
            req.session.error = "Tous les champs n'ont pas été remplis"
            return res.redirect('/docteur/inscription')
    }
    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        req.session.error = "Le mot de passe ne respecte pas tous les critères"
        return res.redirect('/docteur/inscription')
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const pharmacist = new Pharmacist(name, firstName, email, hashPassword, city, address, zipcode)
    pharmacist.setProfessionnalId(typeProfesionnal)
    PharmacistServices.addPharmacist(pharmacist)


})

/**
 * Traite la connexion des pharmaciens
 * @method POST
 */
router.post('/connexion',  async (res,req)=>{
    const password = req.body.password
    const email = requ.body.email
    if (!email || !password) {
        req.session.error = "Remplissez tous les champs"
        return res.redirect('/Pharmacist/registerPharmacist')
    }

    // Récupérer l'objet
    const pharmacist = await PharmacistServices.getPharmacistByEmail(email)

    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), pharmacist.getPassword())
    if (!verifPass) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/Pharmacist/registerPharmacist')
    }

    req.session.user = {encryptedId: pharmacist.getEncryptedId(), type: 'pharmacien'}
    return res.redirect('/doubleauthentification')
})

/**
 * Gère l'affichage de l'ordonnance du patient après le scanne du qr code
 * @method GET
 */
router.get('/pharmacien/ordonnance/:id_ordo', async (req, res) => {
    const id = req.params.id_ordo
    
    const prescription = await PrescriptionService.getPrescriptionById(id)
    res.render ('/pharmacien/ordonnance', { ordonnance : prescription })
})

module.exports = router