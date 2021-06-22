var express  = require('express');
var router = express.Router()
var mDoctors = require('../models/doctorsModel');
var bcrypt = require('bcryptjs')

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
  res.status(200).send(patients) 
})

/*Get doctor information*/
router.get('/:doctorID', async function(req, res, next){
  let id_doctor = req.params.doctorID
  let doctor = await mDoctors.getDoctor(id_doctor)
  res.status(200).send(doctor[0])
})

/*Get tests assigned to doctor's patients*/
router.get('/:doctorID/patients/tests', async function(req, res, next){
  let id_doctor = req.params.doctorID
  let tests = await mDoctors.getPatientsTests(id_doctor)
  res.status(200).send(tests)
})

/*Send data to create a new patient*/
router.post('/:doctorID/patients', async function(req, res, next){
  let id_doctor = req.params.doctorID
  let newPatient = req.body
  newPatient.password = await bcrypt.hash(newPatient.password, 8)
  let patient = await mDoctors.createPatient(newPatient, id_doctor)
  res.status(200).send(patient) 
})


module.exports = router