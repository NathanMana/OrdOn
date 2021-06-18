const express = require('express')
const app = express()

// dependence installer: nodemon, express, ejs, bcrypt
// pour lancer le serveur npm run DevStart ( pas besoin de restart apres avoir save nodemon s en charge )
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

/*app.get('/', (req, res) =>{

})*/





app.listen(8000)