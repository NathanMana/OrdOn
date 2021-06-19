const express = require('express');
const router = require('express')


router.post('/registerPatient', (req, res) => {
    name = req.body.name
    firstName = req.body.firstName
    email = req.body.email
    password = req.body.password

    PatientServices.create(name, firstName, email,password)
})