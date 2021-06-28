const pool = require('./connection.js');

//Get all doctors from database
module.exports.getAllDoctors = async function() {
    try {
        const sql = 'SELECT * FROM Doctor'
        let doctors = await pool.query(sql)
        return doctors
    } catch (error) {
        console.log(error)
        return error
    }

}

// Get all patients associated with a doctor from database
module.exports.getPatients = async function(id_doctor){
    try {
        const sql = 'SELECT * FROM User, Patient, Patient_Doctor WHERE ID_User = ID_User_Patient AND Patient_Doctor.ID_Patient = Patient.ID_Patient AND Patient_Doctor.ID_Doctor = ?'
        let patients = await pool.query(sql,[id_doctor])
        return patients
    } catch (error) {
        console.log(error)
        return error;
    }
}

//Get doctor's info from database
module.exports.getDoctor = async function(id_doctor){
    try {
        const sql = 'SELECT * FROM User WHERE ID_User = (SELECT ID_User_Doctor FROM Doctor WHERE ID_Doctor = ?)'
        let doctor = await pool.query(sql,[id_doctor])
        return doctor
    } catch (error) {
        console.log(error);
        return error
        
    }
}

//Get tests assigned by the doctor from database
module.exports.getPatientsTests = async function(id_doctor){
    try {
        const sql = 'SELECT User.name_User, Test.ID_Test, Test.Date_Test, Test.Test_Type, Test_Type.name_Test_Type, Test_State.name_Test_State, Test.Test_Configuration FROM Test, Test_Type, Test_State, Patient_Doctor, User, Patient WHERE Test.Test_State = Test_State.ID_Test_State AND Test.Test_Type = Test_Type.ID_Test_Type AND Test.ID_Patient_Doctor = Patient_Doctor.ID_Patient_Doctor AND Patient.ID_Patient = Patient_Doctor.ID_Patient AND User.ID_User = Patient.ID_User_Patient AND Patient_Doctor.ID_Doctor = ?'
        let patients_tests = await pool.query(sql,[id_doctor])
        return patients_tests
    } catch (error) {
        console.log(error);
        return error
    }
}


//Inser a new doctor to the database
module.exports.createDoctor = async function(doctor){
    try {
        const sql = 'INSERT INTO User(name_User, password_User, email_User, tel_User) VALUES (?,?,?,?)'
        let user = await pool.query(sql, [doctor.name, doctor.password, doctor.email, doctor.tel ])

        const sql2 = 'INSERT INTO Doctor(ID_Doctor, ID_User_Doctor) VALUES (NULL, ?) '
        let newDoctor = await pool.query(sql2, [user.insertId])
        
        return {user,newDoctor}
    } catch (error) {
        console.log(error)
        return error
    }
}

//Insert a new patient to the database
module.exports.createPatient = async function(patient_obj, id_doctor){
    try {
        const sql = 'INSERT INTO User(name_User, password_User, email_User, tel_User) VALUES (?,?,?,?)'
        let user = await pool.query(sql,[patient_obj.name, patient_obj.password, patient_obj.email, patient_obj.tel])

        const sql2 = 'INSERT INTO Patient(ID_User_Patient, ID_Patient) VALUES (?,NULL)'
        let patient = await pool.query(sql2,[user.insertId])

        const sql3 = 'INSERT INTO Patient_Doctor(ID_Patient_Doctor, ID_Patient, ID_Doctor) VALUES (NULL,?,?)'
        let association = await pool.query(sql3,[patient.insertId, id_doctor])
        return {user: user, patient: patient, association: association}
    } catch (error) {
        console.log(error);
        return error
    }
}

//Connect doctor and user by email
module.exports.createPatientAlternative = async function(email_patient, id_doctor){
    try {
        const sql = 'SELECT ID_Patient FROM Patient WHERE ID_User_Patient = (SELECT ID_USer FROM User WHERE email_User = ?)'
        let patient = await pool.query(sql, [email_patient])

        const sql2 = 'INSERT INTO Patient_Doctor(ID_Patient, ID_Doctor) VALUES (?,?)'
        let association = await pool.query(sql2, [patient[0].ID_Patient, id_doctor])
        return association
    } catch (error) {
        console.log(error);
        return error;
    }
}
