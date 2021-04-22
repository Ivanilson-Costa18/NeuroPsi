const pool = require('./connection.js');

module.exports.getAllTests = async function() {
    try {
        const sql = 'SELECT * FROM Test'
        let tests = await pool.query(sql)
        return tests
    } catch (error) {
        console.log(error)
        return error
    }

} 
