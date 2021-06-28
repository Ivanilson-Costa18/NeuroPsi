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
        const sql = 'SELECT name_User, ID_Test, name_Test_Type, Date_Test, Test_Configuration FROM User, Patient, Patient_Doctor, Test, Test_Type WHERE Test_State = 2 AND Test_Type = ID_Test_Type AND User.ID_User = Patient.ID_User_Patient AND Patient_Doctor.ID_Patient_Doctor = Test.ID_Patient_Doctor AND Patient_Doctor.ID_Patient = Patient.ID_Patient AND Patient.ID_Patient = ?'
        let tests = await pool.query(sql,[id_patient])
        return tests
    } catch (error) {
        console.log(error);
        return error
    }
} 

module.exports.createPatient = async function(patient_obj){
    try{
        
        const sql = 'INSERT INTO User(name_User, password_User, email_User, tel_User) VALUES (?,?,?,?)'
        let user = await pool.query(sql, [patient_obj.name, patient_obj.password, patient_obj.email, patient_obj.tel ])

        const sql2 = 'INSERT INTO Patient(ID_Patient, ID_User_Patient) VALUES (NULL, ?) '
        let patient = await pool.query(sql2, [user.insertId])

        return {user,patient}
    } catch (error) {
        console.log(error)
    }
}


//Assign new test to a certain user
module.exports.createTest = async function(test_obj, id){
    try {
        const sql = 'SELECT ID_Patient_Doctor FROM Patient_Doctor WHERE ID_Patient = ?'
        let association = await pool.query(sql, [id])

        const sql2 = 'INSERT INTO Test(ID_Patient_Doctor, Test_Type, Test_Configuration) VALUES (?,?,?)'
        let test = await pool.query(sql2,[association[0].ID_Patient_Doctor, test_obj.Test_Type, test_obj.Test_Configuration])

        return {test}
    } catch (error) {
        console.log(error);
        return error
    }
}