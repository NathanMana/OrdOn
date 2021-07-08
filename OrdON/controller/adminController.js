/* GERE LES ROUTES DU MEDECIN */
/* "/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/"  */
const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const nodemailer = require('../externalsAPI/NodeMailer')

const AdminServices = require('../services/AdminServices')
const DoctorServices = require('../services/DoctorServices')
const PharmacistServices = require('../services/PharmacistServices')

router.get('/creationCompteRapide', async (req, res) => {
    const email = "votreEmail"
    const password = "votreMdp"
    const hashPassword = await bcrypt.hash(password, 10)
    AdminServices.addAdmin(email, hashPassword)
    return res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/connexion')
})

/**
 * Créer un locals utilisable en ejs
 */
 router.use((req, res, next) => {
    res.locals.user = req.session.user
    next()
})


/**
 * Formulaire de connexion
 * @method GET
 */
router.get('/connexion', (req, res) => {
    if (req.session.error) {
        res.locals.error = req.session.error
        req.session.error = undefined
    }
    res.render('Admin/connection')
})

/**
 * Formulaire de connexion
 * @method POST
 */
router.post('/connexion', async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        req.session.error = "Remplissez tous les champs"
        return res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/connexion')
    }

    // Récupérer l'objet
    const admin = await AdminServices.getAdminByEmail(email)

    // Vérification mdp
    const verifPass = await bcrypt.compare(password, admin.password)
    if (!verifPass) {
        req.session.error = "L'identifiant ou le mot de passe est incorrect"
        return res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/connexion')
    }

    req.session.user = {email: email, isValidated: false}

    return res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/doubleauthentification')
})

router.get('/doubleauthentification', (req, res) => {
    if (!req.session.user || !req.session.user.email) {
        return res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/connexion')
    }
    req.session.user.entier = Math.floor(Math.random() * (199999 - 100000 + 1)) + 100000;
    nodemailer(
        req.session.user.email,
        'Votre  code est '+req.session.user.entier,
        'votre code est '+req.session.user.entier,
        'votre code est '+req.session.user.entier
    )
    res.render('Admin/doubleAuth')
})

router.post('/doubleauthentification', (req, res) => {
    if (!req.session.user || !req.session.user.email) {
        return res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/connexion')
    }

    if (req.body.code != req.session.user.entier) {
        req.session.error = "Le code est mauvais"
        return res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/doubleauthentification')
    }
    req.session.user.entier = undefined;
    req.session.user.isValidated = true
    res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/')
})

/**
 * Vérifie les droits d'accès a chaque requête
 */
 router.use((req, res, next) => {
    if (typeof req.session.user === 'undefined' || !req.session.user || !req.session.user.isValidated) {
        return res.redirect("/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/connexion")
    }
    next()
})

/**
 * Accueil
 * @method GET
 */
 router.get('/', async (req, res) => {
    // Récupérer la liste des pros qui n'ont pas un compte validé
    const listDoctors = await DoctorServices.getListUnvalidatedDoctors()
    let arrayDoctors = []
    if (listDoctors)  arrayDoctors = listDoctors.map(e => e.toObject())

    const listPharmacists = await PharmacistServices.getListUnvalidatedPharmacists()
    let arrayPharmacists = []
    if (listPharmacists)  arrayPharmacists = listPharmacists.map(e => e.toObject())

    res.render('Admin/home', {doctors : arrayDoctors, pharmacists : arrayPharmacists})
})

/**
 * Affiche le formulaire du médecin
 * @method GET
 */
router.get('/validation/medecin/:id', async (req, res) => {
    // Récupérer le profil du pro
    if (!req.params.id) return
    const doctor = await DoctorServices.getDoctorById(req.params.id)
    if (!doctor) return
    res.render('Admin/pro_form', {
        pro: doctor.toObject(), 
        proType : 'Médecin', 
        link : "medecin/" + doctor.getDoctorId()
    })
})

/**
 * Affiche le formulaire du médecin
 * @method GET
 */
 router.get('/validation/pharmacien/:id', async (req, res) => {
    // Récupérer le profil du pro
    if (!req.params.id) return
    const pharmacist = await PharmacistServices.getPharmacistById(req.params.id)
    if (!pharmacist) return

    res.render('Admin/pro_form', {
        pro: pharmacist.toObject(), 
        proType : 'Pharmacien', 
        link: "pharmacien/" + pharmacist.getPharmacistId()
    })
})

/**
 * Valider le profil du médecin
 * @method GET
 */
router.get('/accepter/medecin/:id', async (req, res) => {
    // Récupérer le profil du pro
    if (!req.params.id) return
    let doctor = await DoctorServices.getDoctorById(req.params.id)
    doctor.setIsAccountValidated(true)
    DoctorServices.updateDoctor(doctor)
    /**
     * Envoi un mail
     */
     nodemailer(
        doctor.getEmail(),
        'Création du compte acceptée',
        "Bonjour, nous sommes ravi de vous annoncer que votre demande de validation a été validée."
    )
    res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/')
})

/**
 * Valider le profil du pharmacien
 * @method GET
 */
 router.get('/accepter/pharmacien/:id', async (req, res) => {
    // Récupérer le profil du pro
    if (!req.params.id) return
    let pharmacist = await PharmacistServices.getPharmacistById(req.params.id)
    pharmacist.setIsAccountValidated(true)
    PharmacistServices.updatePharmacist(pharmacist)
    /**
     * Envoi un mail
     */
    nodemailer(
        pharmacist.getEmail(),
        'Création du compte acceptée',
        "Bonjour, nous sommes ravi de vous annoncer que votre demande de validation a été validée."
    )
    res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/')
})

/**
 * Valider le profil du médecin
 * @method GET
 */
 router.get('/refuser/medecin/:id', async (req, res) => {
    // Récupérer le profil du pro
    if (!req.params.id) return
    let doctor = await DoctorServices.getDoctorById(req.params.id)
    doctor.setIsAccountValidated(false)
    doctor.setProofPath(null)
    DoctorServices.updateDoctor(doctor)
    
    /**
     * Envoi un mail
     */
    nodemailer(
        doctor.getEmail(),
        'Création du compte refusée',
        "Bonjour, nous sommes désolé de vous annoncer que votre demande de validation de compte a été refusée."
    )

    res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/')
})

/**
 * Valider le profil du pharmacien
 * @method GET
 */
 router.get('/refuser/pharmacien/:id', async (req, res) => {
    // Récupérer le profil du pro
    if (!req.params.id) return
    let pharmacist = await PharmacistServices.getPharmacistById(req.params.id)
    pharmacist.setIsAccountValidated(false)
    pharmacist.setProofPath(null)
    PharmacistServices.updatePharmacist(pharmacist)
    
    /**
     * Envoi un mail
     */
    nodemailer(
        pharmacist.getEmail(),
        'Création du compte refusée',
        "Bonjour, nous sommes désolé de vous annoncer que votre demande de validation de compte a été refusée."
    )

    res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/')
})


module.exports = router