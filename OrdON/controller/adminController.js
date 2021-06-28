/* GERE LES ROUTES DU MEDECIN */
/* "/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/"  */
const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const nodemailer = require('../externalsAPI/NodeMailer')

const AdminServices = require('../services/AdminServices')
const Profesionnal = require('../models/Profesionnal')
const ProfessionnalServices = require('../services/ProfessionnalServices')
const Doctor = require('../models/Doctor')
const DoctorServices = require('../services/DoctorServices')
const PharmacistServices = require('../services/PharmacistServices')

/**
 * Formulaire de connexion
 * @method GET
 */
router.get('/connexion', (req, res) => {
    res.render('Admin/connection')
})

/**
 * Formulaire de connexion
 * @method POST
 */
router.post('/connexion', async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) return

    // Récupérer l'objet
    const admin = await AdminServices.getAdminByEmail(email)

    // Vérification mdp
    const verifPass = await bcrypt.compare(password, admin.password)
    if (!verifPass) {
       return res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/connexion')
    }

    req.session.user = {email: email}

    return res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/')
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
        'Validation du compte acceptée',
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
        'Validation du compte acceptée',
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
        'Validation du compte refusée',
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
        'Validation du compte refusée',
        "Bonjour, nous sommes désolé de vous annoncer que votre demande de validation de compte a été refusée."
    )

    res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/')
})



router.get('/t', async (req, res) => {
    const password = ""
    const hashPassword = await bcrypt.hash(password, 10)
    AdminServices.addAdmin("nat.manar@gmail.com", hashPassword)
})


module.exports = router