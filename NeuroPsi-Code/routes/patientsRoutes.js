var express  = require('express');
var router = express.Router()
var mPatients = require('../models/patientsModel');

router.get('/', async function(req,res,next){
    let patients = await mPatients.getAllPatients()
    patients.length > 0 ? res.status(200).send(patients) : res.status(404).json({
        "status":404,
        "error":"Not Found",
        "message":"The requested resource does not exist",
        "detail": "There are no tests"
      });
})

module.exports = router