var express  = require('express');
var router = express.Router()
var mPatients = require('../models/patientsModel');

/*Get all patients*/
router.get('/', async function(req,res,next){
    let patients = await mPatients.getAllPatients()
    patients.length > 0 ? res.status(200).send(patients) : res.status(404).json({
        "status":404,
        "error":"Not Found",
        "message":"The requested resource does not exist",
        "detail": "There are no patients"
      });
})

/*Get patient information*/
router.get('/:patientID', async function(req,res,next){
  let id_patient = req.params.patientID
  let patient = await mPatients.getPatient(id_patient)
  patient.length > 0 ? res.status(200).send(patient) : res.status(404).send([]);
})

/*Get test assigned to the patient*/
router.get('/:patientID/tests', async function(req,res,next){
  let id_patient = req.params.patientID
  let tests = await mPatients.getTests(id_patient)
  res.status(200).send(tests)
})

module.exports = router