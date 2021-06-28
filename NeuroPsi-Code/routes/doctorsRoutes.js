var express  = require('express');
var router = express.Router()
var mDoctors = require('../models/doctorsModel');
var bcrypt = require('bcryptjs');
const { requireAuth } = require('../middleware/authMiddleware');


/*Get all doctors*/
router.get('/', async function(req,res,next){
    let doctors = await mDoctors.getAllDoctors()
    doctors.length > 0 ? res.status(200).send(doctors) : res.status(404).json({
        "error":"Not Found",
        "message":"The requested resource does not exist",
        "detail": "There are no doctors"
      });
})

/* Get all patients from a specific doctor*/
router.get('/:doctorID/patients', requireAuth, async function(req,res,next){
  let id_doctor = req.params.doctorID  
  let patients = await mDoctors.getPatients(id_doctor)
  patients.length > 0 ? res.status(200).send(patients) : res.status(404).send({
      "error":"Not Found",
      "message":"The requested resource does not exist",
      "detail": "No patients associated with this doctor"
    })
})

/*Get doctor information*/
router.get('/:doctorID', requireAuth, async function(req, res, next){
  let id_doctor = req.params.doctorID
  let doctor = await mDoctors.getDoctor(id_doctor)
  res.status(200).send(doctor[0])
})

/*Get tests assigned to doctor's patients*/
router.get('/:doctorID/patients/tests', requireAuth,async function(req, res, next){
  let id_doctor = req.params.doctorID
  let tests = await mDoctors.getPatientsTests(id_doctor)
  tests.length > 0 ? res.status(200).send(tests) : res.status(404).send({
    "error":"Not Found",
    "message":"The requested resource does not exist",
    "detail": "No tests were assigned"
  })
})

/*Send data to create a new patient*/
router.post('/:doctorID/patients', requireAuth, async function(req, res, next){
  let id_doctor = req.params.doctorID
  let newPatient = req.body
  newPatient.password = await bcrypt.hash(newPatient.password, 8)
  let patient = await mDoctors.createPatient(newPatient, id_doctor)
  console.log(patient)
  res.status(200).send(patient) 
})

/*Send email to associte*/
router.post('/:doctorID/patients/:email', requireAuth, async function(req,res,next){
  let id_doctor = req.params.doctorID
  let email_patient = req.params.email
  let association = await mDoctors.createPatientAlternative(email_patient, id_doctor)
  console.log(association)
  res.status(200).send(association)
})

module.exports = router