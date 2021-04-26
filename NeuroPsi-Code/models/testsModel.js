const pool = require('./connection.js');

module.exports.getAllTests = async function() {
    try {
        const sql = 'SELECT * FROM Test_Type'
        let tests = await pool.query(sql)
        return tests
    } catch (error) {
        console.log(error)
        return error
    }

} 

module.exports.createTest = async function(test_obj){
    try {
        const sql = 'INSERT INTO Test_Patient(ID_Patient, Test_Type) VALUES (?,?)'
        let test = await pool.query(sql,[test_obj.patientID, test_obj.testType])
    } catch (error) {
        console.log(error);
        return error
    }
}

module.exports.getFigure = async function(id_test){
    try {
        const sql = 'SELECT * FROM Figure WHERE ID_TestPatient = ?'
        let figure = await pool.query(sql,[id_test])
        return figure
    } catch (error) {
        console.log(error);
        return error
    }
}