var express  = require('express');
var router = express.Router()
var mPatients = require('../models/patientsModel');
const { requireAuth } = require('../middleware/authMiddleware');


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
  patient.length > 0 ? res.status(200).send(patient[0]) : res.status(404).send([]);
})

/*Get test assigned to the patient*/
router.get('/:patientID/tests', async function(req,res,next){
  let id_patient = req.params.patientID
  let tests = await mPatients.getTests(id_patient)
  res.status(200).send(tests)
})

/*Assign test to the patient*/
router.post('/:patientID/tests', requireAuth, async function(req,res,next){
  let id_patient = req.params.patientID
  let newTest = req.body
  let test = await mPatients.createTest(newTest, id_patient);
  res.status(200).send(test)
})

module.exports = router