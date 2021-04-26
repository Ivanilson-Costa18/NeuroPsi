const pool = require('./connection.js');

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

module.exports.getTests = async function(id_patient) {
    try {
        const sql = 'SELECT * FROM Test_Patient WHERE ID_Patient = ? and Test_State = 2'
        let tests = await pool.query(sql,[id_patient])
        return tests
    } catch (error) {
        console.log(error);
        return error
    }
} 

