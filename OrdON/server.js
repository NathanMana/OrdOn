const express = require('express')
const sharedRoutes = require('./controller/sharedController.js')
const doctorRoutes = require('./controller/doctorController.js')
const app = express()
app.listen(8000)

// dependence installer: nodemon, express, ejs, bcrypt
// pour lancer le serveur npm run DevStart ( pas besoin de restart apres avoir save nodemon s en charge )
app.set('view engine', 'ejs')

// Gestion des fichiers locaux
app.use('/src/', express.static('src'))
app.use(express.urlencoded({ extended: false }))

// Rediriger vers les controlleurs appropriés
app.use('/', sharedRoutes)
app.use('/docteur/', doctorRoutes)


