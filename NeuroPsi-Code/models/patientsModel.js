const pool = require('./connection.js');

//Get all patients from database
module.exports.getAllPatients = async function() {
    try {
        const sql = 'SELECT * FROM Patient'
        let patients = await pool.query(sql)
        return patients
    } catch (error) {
        console.log(error)
        return error
    }
}

//Get patient information from database
module.exports.getPatient = async function(id_patient){
    try {
        const sql = 'SELECT * FROM User WHERE ID_USER = (SELECT ID_User_Patient FROM Patient WHERE ID_Patient=?)'
        let patient = await pool.query(sql,[id_patient])
        return patient
    } catch (error) {
        console.log(error)
        return error
    }
}

//Get unsolved tests from a patient
module.exports.getTests = async function(id_patient) {
    try {
        const sql = 'SELECT ID_Test_Patient, Date_Test_Patient, type_Test FROM Test_Patient, Test_Type WHERE ID_Patient = ? and state_Test_Patient = 2'
        let tests = await pool.query(sql,[id_patient])
        return tests
    } catch (error) {
        console.log(error);
        return error
    }
} 

