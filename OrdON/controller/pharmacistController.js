/* GERE LES ROUTES DU PHARMACIEN */
/* "/pharmacien/"  */
const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt')
const Pharmacist = require('./../models/Pharmacist')
const PharmacistServices = require('../services/PharmacistServices')
const Prescription = require('./../models/Prescription')
const PrescriptionService = require('./../services/PrescriptionServices')
const PatientService = require('./../services/PatientServices')
const DoctorService = require('./../services/DoctorServices')
const nodemailer = require('../externalsAPI/NodeMailer');

router.get('/connexion', (req, res)=>{
    res.render('Pharmacist/connectionPharmacist')
})

/**
 * Traite la connexion des pharmaciens
 * @method POST
 */
 router.post('/connexion',  async (req, res)=>{
    const password = req.body.password
    const email = req.body.email
    if (!email || !password) {
        req.session.error = "Remplissez tous les champs"
        return res.redirect('/pharmacien/connexion')
    }

    // Récupérer l'objet
    const pharmacist = await PharmacistServices.getPharmacistByEmail(email)
    if (!pharmacist) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/pharmacien/connexion')
    }

    if (!pharmacist.getIsEmailVerified()) {
        req.session.error = "Vous n'avez pas vérifié votre email"
        return res.redirect('/pharmacien/connexion')
    }

    if (!pharmacist.getIsAccountValidated()) {
        req.session.error = "Votre compte est toujours en attente de validation par un modérateur"
        return res.redirect('/pharmacien/connexion')
    }

    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), pharmacist.getPassword())
    if (!verifPass) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/pharmacien/connexion')
    }

    req.session.user = {encryptedId: pharmacist.getEncryptedId(), entier: entierAleatoire(100000,199999), type: 'pharmacien'}
    nodemailer(pharmacist.getEmail(),'votre code est '+req.session.user.entier,'votre code est '+req.session.user.entier,'votre code est '+req.session.user.entier)
    return res.redirect('/doubleauthentification')
})

router.get('/inscription', (req, res)=>{
    res.render('Pharmacist/registerPharmacist')
})

/**
 * Traite l'inscription des pharmaciens
 * @method POST
 */
router.post('/inscription', async (req, res) => {
    const name = req.body.name
    const firstName = req.body.firstName
    const email = req.body.email
    const password = JSON.stringify(req.body.password)
    const city = req.body.city
    const address = req.body.address
    const zipcode = req.body.zipcode
    const password_check = JSON.stringify(req.body.password_check)
    const gender = req.body.gender

    if (!name || !firstName || !email || !password || !city || !zipcode || !address || !password_check || !gender) {
            req.session.error = "Tous les champs n'ont pas été remplis"
            return res.redirect('/pharmacien/inscription')
    }
    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        req.session.error = "Le mot de passe ne respecte pas tous les critères"
        return res.redirect('/pharmacien/inscription')
    }
    if (password !== password_check) {
        req.session.error = "Les mots de passe ne correspondent pas"
        return res.redirect('/pharmacien/inscription')
    }

    // Vérifier si l'email est déjà utilisé
    if(await PharmacistServices.isEmailPresent(email)) {
        req.session.error = "Cet email est déjà utilisé"
        return res.redirect('/pharmacien/inscription')
    }

    const hashPassword = await bcrypt.hash(password, 10)
    let pharmacist = new Pharmacist(name, firstName, email, hashPassword, city, address, zipcode, gender)
    pharmacist = await PharmacistServices.addPharmacist(pharmacist)
    
    nodemailer(
        email, 
        "Confirmation d'inscription à OrdON", 
        "Veuillez cliquer sur le lien ci-contre pour valider votre inscription : http://localhost:8000/pharmacien/email/verification/" + pharmacist.getTokenEmail(),
        "<p>Veuillez cliquer sur le lien ci-contre pour valider votre inscription :</p><a href='http://localhost:8000/pharmacien/email/verification/" + pharmacist.getTokenEmail()
    )
 
    return res.redirect('/email/verification/envoyee')
})

/**
 * Traitement de la vérification d'un patient
 */
 router.get('/email/verification/:token', async (req, res) => {
    const token = req.params.token
    if (!token) return res.status(500).send("Une erreur est survenue")
 
    // Essayer de récupérer le patient correspondant
    const pharmacist = await PharmacistServices.getPhamacistByTokenEmail(token)
    if (!pharmacist) return res.status(500).send("Une erreur est survenue")
 
    // On peut certifier que l'email est vérifié
    pharmacist.setIsEmailVerified(true)
    pharmacist.setTokenEmail(null)
    PharmacistServices.updatePharmacist(pharmacist)

    req.session.flash = {
        success : "Votre email a été validé, vous devez attendre maintenant que votre compte soit validé par un modérateur. Un email vous sera envoyé pour confirmer votre inscription"
    }
    return res.redirect('/')
})


function entierAleatoire(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Vérifie les droits d'accès a chaque requête
 */
 router.use((req, res, next) => {
    if (typeof req.session.user === 'undefined' || !req.session.user || req.session.user.type != "pharmacien") {
        return res.redirect("/pharmacien/connexion")
    }
    if (!req.session.user.isValidated) return res.redirect("/pharmacien/connexion")
    next()
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
 * Gère l'affichage de l'ordonnance du patient après le scanne du qr code
 * @method GET
 */
 router.get('/ordonnance/:id_ordo', async (req, res) => {
    const id = req.params.id_ordo

    const prescription = await PrescriptionService.getPrescriptionById(id)
    const patient = await PatientService.getPatientById(prescription.getPatientId())
    const doctor = await DoctorService.getDoctorById(prescription.getDoctorId())
    const ordonnance = {
        prescription: prescription,
        patient: patient,
        docteur: doctor
    }
    res.render ('/Pharmacist/viewOrdonnance', { ordonnance : ordonnance })
})

module.exports = router