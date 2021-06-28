const pool = require('./connection.js');

module.exports.getUser = async function(id_user){
    try {
        const sql = 'SELECT * FROM User WHERE ID_User = ?'
        let user = await pool.query(sql,[id_user])
        return user
    } catch (error) {
        console.log(error);
        return error
        
    }
}

