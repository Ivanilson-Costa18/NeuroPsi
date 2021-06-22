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
        const sql = 'SELECT * FROM User, Patient WHERE ID_User = ID_User_Patient AND ID_Doctor_Patient = ?'
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
        const sql = 'SELECT ID_Test_Patient, Test_Patient.ID_Patient, name_User, type_Test, Date_Test_Patient, CompleteDate_Test_Patient, Test_State FROM Test_Patient, Test_Type, Test_State, User, Patient WHERE Test_Patient.ID_Patient = Patient.ID_Patient AND ID_User = ID_User_Patient AND ID_Test_State = state_Test_Patient AND Test_Type = ID_Test_Type AND ID_Doctor_Patient = ?'
        let patients_tests = await pool.query(sql,[id_doctor, id_doctor])
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

        const sql2 = 'INSERT INTO Patient(ID_User_Patient, ID_Doctor_Patient) VALUES (?,?)'
        let patient = await pool.query(sql2,[user.insertId, id_doctor])
        return {user: user, patient: patient}
    } catch (error) {
        console.log(error);
        return error
    }
}

