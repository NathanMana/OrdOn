const express = require('express')
const sharedRoutes = require('./controller/sharedController.js')
const doctorRoutes = require('./controller/doctorController.js')
const pharmacistRoutes = require('./controller/pharmacistController.js')
const patientRoutes = require('./controller/patientController.js')
const adminRoutes = require('./controller/adminController.js')
const app = express()
const session = require('express-session')
app.listen(8000)

// dependence installer: nodemon, express, ejs, bcrypt
// pour lancer le serveur npm run DevStart ( pas besoin de restart apres avoir save nodemon s en charge )
app.set('view engine', 'ejs')

// Gestion des fichiers locaux
app.use('/src/', express.static('src'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: "xwhjbapoioskjq",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false} // Doit être à true si on est en https
}))

// Rediriger vers les controlleurs appropriés
app.use('/', sharedRoutes)
app.use('/docteur/', doctorRoutes)
app.use('/pharmacien/', pharmacistRoutes)
app.use('/patient/', patientRoutes)
app.use('/administration-eazhgzje54456645ghaeza-backoffice-ljdfskdf4545jsd-security/', adminRoutes)
