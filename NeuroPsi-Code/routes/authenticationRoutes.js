var express = require('express')
var router = express.Router()
var mDoctors = require('../models/doctorsModel')
var mPatients = require('../models/patientsModel')
var pool = require('../models/connection')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
var nodemailer = require('nodemailer')


router.post('/login', async function(req, res, next){
    try {
        let user = req.body
        if(!user.email || !user.password){
            return res.status(400).json({
                message: 'Please provide an email and password'
            });
        }

        await pool.query('SELECT * FROM User WHERE email_User = ?',[user.email], async (error, results) => {
            if(error){
                console.log(error);
                return error;
            }    
            console.log(results)
            if (!results || !(await bcrypt.compare(user.password, results[0].password_User))){
                return res.status(401).send({
                    "message": 'Email or password is incorrect'
                });
            } else {
                 const id = results[0].ID_User
                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('cookie4U', token, cookieOptions)

                await pool.query('SELECT * FROM Doctor WHERE ID_User_Doctor = ?',[id], async (error, doctor) => {
                    if(doctor.length){ 
                        return res.status(200).send({"id":doctor[0].ID_Doctor, "type": "doctor"})
                    }else{
                        await pool.query('SELECT * FROM Patient WHERE ID_User_Patient = ?',[id], (error, patient) => {
                            if(results){
                                return res.status(200).send({"id":patient[0].ID_Patient, "type": "patient"})
                            }else{ 
                                return
                            }
                        })
                    } 
                })
                
            }

        })
    } catch (error) {
        console.log(error)
        return error
    }
})


router.post('/register', async function(req, res, next){
    let userData = req.body
    await pool.query('SELECT * FROM User WHERE email_User = ? ', [userData.email], async (error, results) => {
        if (error){
             console.log(error)
             return error
         }

         if (results.length > 0){
            return  res.status(400).json({
               message: 'Email already in use'
            })
         }
        userData.password = await bcrypt.hash(userData.password, 8)
        if(userData.type == "doctor"){
            let newDoctor = await mDoctors.createDoctor(userData)
            console.log(newDoctor);
            return res.status(200).send(newDoctor)
        } else {
            let newPatient = await mPatients.createPatient(userData)
            console.log(newPatient);
            return res.status(200).send(newDoctor)
        }
    })
})


router.post('/verify/:email',async (req,res,next) => {
    let email = req.params.email
    let code = Math.floor(100000 + Math.random() * 900000)

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    let send = await transporter.sendMail({
                    from: 'neuropsi2021.EI@gmail.com',
                    to: email,
                    subject: 'Verify Account',
                    text: 'Here\'s your code: '+ code
                }) 

    if(send.accepted.length > 0){
        return res.status(200).send({"code": code})
    } else {
        return res.status(400).send({"message": "Email doesn't exist"})
    }               
})

module.exports = router