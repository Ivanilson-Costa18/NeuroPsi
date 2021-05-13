var express  = require('express');
var router = express.Router()
var mDoctors = require('../models/doctorsModel');

/*Get all doctors*/
router.get('/', async function(req,res,next){
    let doctors = await mDoctors.getAllDoctors()
    doctors.length > 0 ? res.status(200).send(doctors) : res.status(404).json({
        "status":404,
        "error":"Not Found",
        "message":"The requested resource does not exist",
        "detail": "There are no doctors"
      });
})

/* Get all patients from a specific doctor*/
router.get('/:doctorID/patients', async function(req,res,next){
  let id_doctor = req.params.doctorID  
  let patients = await mDoctors.getPatients(id_doctor)
  patients.length > 0 ? res.status(200).send(patients) : res.status(404).json({
    "status":404,
    "error":"Not Found",
    "message":"The requested resource does not exist",
    "detail": "There are no patients associated with this ID"
  });
})

/*Get doctor information*/
router.get('/:doctorID', async function(req, res, next){
  let id_doctor = req.params.doctorID
  let doctor = await mDoctors.getDoctor(id_doctor)
  doctor.length > 0 ? res.status(200).send(doctor[0]) : res.status(404).json({
    "status":404,
    "error":"Not Found",
    "message":"The requested resource does not exist",
    "detail": "This doctor does not exist"
  });
})

/*Get tests assigned to doctor's patientsP*/
router.get('/:doctorID/patients/tests', async function(req, res, next){
  let id_doctor = req.params.doctorID
  let tests = await mDoctors.getPatientsTests(id_doctor)
  tests.length > 0 ? res.status(200).send(tests) : res.status(404).json({
    "status":404,
    "error":"Not Found",
    "message":"The requested resource does not exist",
    "detail": "No tests have been assigned"
  });
})

/*Send data to create a new patient*/
router.post('/:doctorID/patients', async function(req, res, next){
  let id_doctor = req.params.doctorID
  let newPatient = req.body
  let patient = await mDoctors.createPatient(newPatient, id_doctor)
  res.status(200).send(patient) 
})


module.exports = router