const pool = require('./connection.js');

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