var express  = require('express');
var router = express.Router()
var mDoctors = require('../models/doctorsModel');

router.get('/', async function(req,res,next){
    let doctors = await mDoctors.getAllDoctors()
    doctors.length > 0 ? res.status(200).send(doctors) : res.status(404).json({
        "status":404,
        "error":"Not Found",
        "message":"The requested resource does not exist",
        "detail": "There are no tests"
      });
})

module.exports = router