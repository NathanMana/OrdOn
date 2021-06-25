/* GERE LES ROUTES DU MEDECIN */
/* "/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/"  */
const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
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
    if (listDoctors)  listDoctors.map(e => e.toObject())

    res.render('Admin/home', {doctors : arrayDoctors})
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
    console.log(doctor.toObject())
    res.render('Admin/pro_form', {pro: doctor.toObject(), proType : 'Médecin'})
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

    res.render('Admin/pro_form', {pro: pharmacist, proType : 'Pharmacien'})
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
    res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/')
})

/**
 * Valider le profil du pharmacien
 * @method GET
 */
 router.get('/accepter/pharmacien/:id', async (req, res) => {
    // Récupérer le profil du pro
    if (!req.params.id) return
    let pharmacist = await PharmacistServices.getDoctorById(req.params.id)
    docpharmacientor.setIsAccountValidated(true)
    PharmacistServices.updatePharmacist(pharmacist)
    res.redirect('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/')
})


// router.post('/t', async (req, res) => {
//     const password = ""
//     const hashPassword = await bcrypt.hash(password, 10)
//     AdminServices.addAdmin("nat.manar@gmail.com", hashPassword)
// })


module.exports = router