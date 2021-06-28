const pool = require('./connection')


//Insert figure data to the database
module.exports.saveFigure = async function(figure_obj){
    try {
        const sql = 'INSERT INTO Rey_Drawing(ID_Test, Actions_Rey_Drawing) VALUES (?, ?)'
        await pool.query(sql, [figure_obj.ID_Test, figure_obj.Actions_Rey_Drawing])

        const sql2 = 'UPDATE Test SET Test_State = 1 WHERE ID_Test = ?'
        await pool.query(sql2, [figure_obj.ID_Test])

        const sql3 = 'INSERT INTO Test_History(ID_Test) VALUES (?)'
        await pool.query(sql3, [figure_obj.ID_Test])
    } catch (error) {
        console.log(error)
    }
}