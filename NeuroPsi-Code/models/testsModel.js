const pool = require('./connection.js');


//Get all test types from database
module.exports.getAllTestsTypes = async function() {
    try {
        const sql = 'SELECT * FROM Test_Type'
        let tests = await pool.query(sql)
        return tests
    } catch (error) {
        console.log(error)
        return error
    }

} 

//Get figure associated to one test
module.exports.getFigure = async function(id_test){
    try {
        const sql = 'SELECT * FROM Rey_Drawing WHERE ID_Test = ?'
        let figure = await pool.query(sql,[id_test])
        return figure
    } catch (error) {
        console.log(error);
        return error
    }
}

//Get moves associated to one test
module.exports.getMoves = async function(id_test){
    try {
        const sql = 'SELECT * FROM Puzzle_Moves WHERE ID_Test = ?'
        let moves = await pool.query(sql,[id_test])
        return moves
    } catch (error) {
        console.log(error);
        return error
    }
}

//Get tests solved in the last 2 days
module.exports.getRecentSolvedTests = async function(id_test){
    try {
        const sql = 'SELECT Test_History.ID_Test, Test_Type.name_Test_Type, User.name_User, Test_History.ID_Test FROM Test, Test_Type, Test_History, User, Patient_Doctor, Patient WHERE Patient_Doctor.ID_Doctor = ? AND Patient_Doctor.ID_Patient = Patient.ID_Patient AND User.ID_User = Patient.ID_User_Patient AND Test.Test_Type = Test_Type.ID_Test_Type AND Test.ID_Patient_Doctor = Patient_Doctor.ID_Patient_Doctor AND Test_History.ID_Test = Test.ID_Test'
        let tests = await pool.query(sql,[id_test])
        return tests
    } catch (error) {
        console.log(error);
    }
}