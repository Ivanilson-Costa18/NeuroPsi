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