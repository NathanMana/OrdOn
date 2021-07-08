/* GERE LES ROUTES DU PHARMACIEN */
/* "/pharmacien/"  */
const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt')
var formidable = require('formidable');
var fs = require('fs');
const pathToProofFolder = require('../modules/pathToProofFolder');

const Pharmacist = require('./../models/Pharmacist')
const PharmacistServices = require('../services/PharmacistServices')
const PrescriptionService = require('./../services/PrescriptionServices')
const PatientService = require('./../services/PatientServices')
const DoctorService = require('./../services/DoctorServices')
const GivenAttribution = require('./../models/AssociationClass/GivenAttribution')
const GivenAttributionServices = require('./../services/GivenAttributionServices')
const nodemailer = require('../externalsAPI/NodeMailer');
const { Console } = require('console');
const AttributionServices = require('../services/AttributionServices');

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

    req.session.user = {encryptedId: pharmacist.getEncryptedId(), type: 'pharmacien'}
   
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
    let form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        const name = fields.name
        const firstName = fields.firstName
        const email = fields.email
        const password = JSON.stringify(fields.password)
        const city = fields.city
        const address = fields.address
        const zipcode = fields.zipcode
        const password_check = JSON.stringify(fields.password_check)
        const gender = fields.gender
    
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

        if (!files.fileUpload.name) {
            req.session.error = "La preuve de profession est obligatoire !"
            return res.redirect('/pharmacien/inscription')
        }

        var oldpath = files.fileUpload.path;
        var newpath = pathToProofFolder + files.fileUpload.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
        });
    
        const hashPassword = await bcrypt.hash(password, 10)
        let pharmacist = new Pharmacist(name, firstName, email, hashPassword, city, address, zipcode, gender)
        //pharmacist.setProofPath(files.fileUpload.name)
        pharmacist = await PharmacistServices.addPharmacist(pharmacist)
        
        nodemailer(
            email, 
            "Confirmation d'inscription à OrdON", 
            "Veuillez cliquer sur le lien ci-contre pour valider votre inscription : http://localhost:8000/pharmacien/email/verification/" + pharmacist.getTokenEmail(),
            "<p>Veuillez cliquer sur le lien ci-contre pour valider votre inscription :</p><a href='http://localhost:8000/pharmacien/email/verification/" + pharmacist.getTokenEmail()
        )
     
        return res.redirect('/email/verification/envoyee')
    });

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
 * Envoi l'email de réinitialisation de mot de passe
 */
 router.post('/motdepasseoublie', async (req, res) => {
    const email = req.body.email
    if (!email) {
        req.session.error = "Vous devez remplir l'email"
        res.redirect('/motdepasseoublie/pharmacien')
    } 

    // On cherche un patient avec cet email
    const pharmacist = await PharmacistServices.getPharmacistByEmail(email)
    if (!pharmacist) {
        req.session.error = "Cet email n'existe pas"
        res.redirect('/motdepasseoublie/pharmacien')
    }

    // On commence le setup pour envoyer le mail
    pharmacist.setTokenResetPassword(pharmacist.encryptId(pharmacist.getPharmacistId()))
    PharmacistServices.updatePharmacist(pharmacist)

    nodemailer(
        pharmacist.getEmail(),
        "Réinitialisation de votre mot de passe",
        "Cliquez sur ce lien pour réinitialiser votre mot de passe : http://localhost:8000/pharmacien/reinitialisation/motdepasse/" + pharmacist.getTokenResetPassword(),
        "Cliquez sur ce lien pour réinitialiser votre mot de passe : <a href='http://localhost:8000/pharmacien/reinitialisation/motdepasse/" + pharmacist.getTokenResetPassword() + "'>http://localhost:8000/pharmacien/reinitialisation/motdepasse/" + pharmacist.getTokenResetPassword() + "</a>"
    )

    return res.render('layouts/emailVerification.ejs')
})


/**
 * Formulaire réinitilsiation mot de passe
 */
 router.get('/reinitialisation/motdepasse/:token', async (req, res) => {
    const token = req.params.token
    if (!token) {
        return res.redirect('/')
    }

    // Trouver le patient
    const pharmacist = await PharmacistServices.getPharmacistByTokenResetPassword(token)
    if (!pharmacist) return res.redirect('/')

    res.render('reinitPassword', {patientId : pharmacist.getEncryptedId(), type: 'pharmacien'})
})

/**
 * Traitement réinitialisation mot de passe
 */
router.post('/reinitialisation/motdepasse/:token', async (req, res) => {
    const {encryptedId} = req.body
    const password = JSON.stringify(req.body.password)
    const check_password = JSON.stringify(req.body.check_password)
    const token = req.params.token
    if (!token) return res.redirect('/')
    if (!password || !check_password || !encryptedId) {
        req.session.error = "Tous les champs n'ont pas été renseignés"
        return res.redirect('/pharmacien/reinitialisation/motdepasse/' + token)
    }

    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        req.session.error = "Le mot de passe ne respecte pas tous les critères"
        return res.redirect('/pharmacien/inscription')
    }
    if (password !== check_password) {
        req.session.error = "Les mots de passe ne correspondent pas"
        return res.redirect('/pharmacien/reinitialisation/motdepasse/' + token)
    }

    const pharmacist = await PharmacistServices.getPharmacistByTokenResetPassword(token)
    if (!pharmacist) return res.redirect('/pharmacien/reinitialisation/motdepasse/' + token)

    const hashPassword = await bcrypt.hash(password, 10)
    pharmacist.setPassword(hashPassword)
    pharmacist.setTokenResetPassword(null)
    PharmacistServices.updatePharmacist(pharmacist)

    // On le connecte directement
    req.session.user = {encryptedId: pharmacist.getEncryptedId(), type: 'pharmacien'}
    req.session.flash = {
        success : "Réinitialisation du mot de passe effectuée avec succès !"
    }
    return res.redirect('/pharmacien/')
})

/**
 * Vérifie les droits d'accès a chaque requête
 */
 router.use((req, res, next) => {
    if (typeof req.session.user === 'undefined' || !req.session.user || req.session.user.type != "pharmacien") {
        req.session.desiredUrl = req.originalUrl
        return res.redirect("/pharmacien/connexion")
    }
    if (!req.session.user.isValidated) {
        req.session.desiredUrl = req.originalUrl
        return res.redirect("/pharmacien/connexion")
    } 
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
 router.get('/profil', async (req, res) => {
    const pharmacien = await PharmacistServices.getPharmacistByEncryptedId(req.session.user.encryptedId)
    res.render('Pharmacist/profil',  { profil : pharmacien.toObject()})
})

/**
 * Gère l'affichage de la page ordonnance archivé du pharmacien
 */
router.get('/ordonnancesarchivees', async (req, res) => {
    const {name, firstname} = req.query
    const pharmacist = await PharmacistServices.getPharmacistByEncryptedId(req.session.user.encryptedId)
    if (!pharmacist) return res.redirect('/')

    let listPrescriptions = await PrescriptionService.getListPrescriptionsByPharmacistId(pharmacist.getPharmacistId())
    listPrescriptions = listPrescriptions.map(e => e.toObject())
    if (name) {
        listPrescriptions = listPrescriptions.filter(c => c.patient.name === name)
    }

    if (firstname) {
        listPrescriptions = listPrescriptions.filter(c => c.patient.firstname === firstname)
    }

    res.render('Pharmacist/ordonnanceArchive', {listPrescriptions})
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
 router.get('/ordonnance/:qrCodeAccess', async (req, res) => {
    const qrCodeAccess = req.params.qrCodeAccess
    if (!qrCodeAccess) return res.redirect('/pharmacien')

    const prescription = await PrescriptionService.getPrescriptionByQRCodeAccess(qrCodeAccess)
    if (!prescription) return res.redirect('/pharmacien')
    prescription.setQRCodeAccess(null)
    PrescriptionService.updateQRCodeAccess(prescription)

    res.render ('Pharmacist/viewOrdonnance', { ordonnance : prescription.toObject() })
})

/**
 * Gère l'enrgistrement d'une given attributions
 * @method POST
 */
router.post('/givenAttribution', async (req, res)=>{
    const encryptedId = req.session.user.encryptedId
    const pharmacist = await PharmacistServices.getPharmacistByEncryptedId(encryptedId)
    if (!pharmacist) res.send({status: false, message: "Une erreur est survenue"})

    // Récupérer les Attributions
    const data = JSON.parse(req.body.data)
    const attributionsId = data.given_attribution_list.map(e => e.id)
    let listAttributions = []
    for (let i = 0; i < attributionsId.length; i++) {
        const attribution = await AttributionServices.getAttributionById(attributionsId[i])
        if (!attribution) res.send({status: false, message: "Une erreur est survenue"})
        listAttributions.push(attribution)
    }

    for (let i = 0; i < data.given_attribution_list.length; i++) {
        const isAlert = (data.given_attribution_list[i].isAlert === 'true')
        const gAttribution = new GivenAttribution(data.given_attribution_list[i].quantity, new Date(), isAlert)
        gAttribution.setIdAttribution(data.given_attribution_list[i].id)
        gAttribution.setIdPharm(pharmacist.getPharmacistId())
        await GivenAttributionServices.addGivenAttribution(gAttribution)
    }

    // Check si on a bouclé l'ordonnance
    let haveToBeArchived = true
    for (let i = 0; i < listAttributions.length; i++) {
        // Récupérer l'ensemble des givenAttributions
        const givenAttributions = await GivenAttributionServices.getListGivenAttributionById(listAttributions[i].getAttributionId())
        let totalQuantity = 0;
        givenAttributions.forEach(ga => {
            totalQuantity += ga.getQuantity()
        })
        if (totalQuantity !== listAttributions[i].getQuantity()) {
            haveToBeArchived = false
        }
    }

    if (haveToBeArchived) {
        const prescription = await PrescriptionService.getPrescriptionById2(listAttributions[0].getPrescriptionId())
        if (!prescription) return res.send({status: false, message: "Une erreur est survenue"})
        prescription.setDateArchived(new Date())
        prescription.setQRCodeAccess(null)
        PrescriptionService.updateDatePrescription(prescription)
    }

    res.send({status: true})
})


router.post('/profil', async (req, res) => {
    const firstname = req.body.firstname
    const name = req.body.name
    const city = req.body.city
    const email = req.body.email
    const gender = req.body.gender

    if (!firstname || !name || !city || !email || !gender) {
        req.session.error = "Tous les champs n'ont pas été renseignés"
        return res.redirect('/pharmacien/profil/')
    }

    let pharmacist = await PharmacistServices.getPharmacistByEncryptedId(req.session.user.encryptedId)
    pharmacist.setFirstname(firstname)
    pharmacist.setName(name)
    pharmacist.setEmail(email)
    pharmacist.setGender(gender)
    pharmacist.setCity(city)
    PharmacistServices.updatePharmacist(pharmacist)
    return res.redirect('/pharmacien/profil/')

})


/**
 * Gère la suppression du compte
 */
 router.post('/profil/supprimermoncompte', async (req, res) => {
    const {password} = req.body
    if (!password) {
        req.session.error = "Tous les champs n'ont pas été remplis"
        return res.redirect('/profil/supprimermoncompte')
    }

    // Récupérer la patient
    const pharmacist = await PharmacistServices.getPharmacistByEncryptedId(req.session.user.encryptedId)
    if (!pharmacist) {
        return res.redirect('/deconnexion')
    }

    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), pharmacist.getPassword())
    if (!verifPass) {
        req.session.error = "Mot de passe incorrect"
        return res.redirect('/profil/supprimermoncompte')
    }

    PharmacistServices.deletePharmacist(pharmacist)
    req.session.user = undefined
    req.session.flash = {
        success : "Compte bien supprimé ! L'équipe OrdON vous souhaite une bonne journée !"
    }
    res.redirect('/')
})


/**
 * Gère la suppression du compte
 */
 router.post('/profil/supprimermoncompte', async (req, res) => {
    const {password} = req.body
    if (!password) {
        req.session.error = "Tous les champs n'ont pas été remplis"
        return res.redirect('/profil/supprimermoncompte')
    }

    // Récupérer la patient
    const patient = await PharmacistServices.getPharmacistByEncryptedId(req.session.user.encryptedId)
    if (!patient) {
        return res.redirect('/deconnexion')
    }

    // Vérification mdp
    const verifPass = await bcrypt.compare(JSON.stringify(password), patient.getPassword())
    if (!verifPass) {
        req.session.error = "Mot de passe incorrect"
        return res.redirect('/profil/supprimermoncompte')
    }

    await PharmacistServices.deletePharmacist(patient)
    req.session.user = undefined
    req.session.flash = {
        success : "Compte bien supprimé ! L'équipe OrdON vous souhaite une bonne journée !"
    }
    res.redirect('/')
})

module.exports = router