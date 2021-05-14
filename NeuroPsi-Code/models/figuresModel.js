const pool = require('./connection')

module.exports.getDefautlFigure = async function(id){
    const sql =  'SELECT * FROM Figure WHERE ID_Figure = ?'
    let figure = await pool.query(sql,[id])
    return figure
}

//Insert figure data to the database
module.exports.saveFigure = async function(figure_obj){
    const sql = 'INSERT INTO Figure(ID_TestPatient, FigureJSON) VALUES (?, ?)'
    let figure = await pool.query(sql, [figure_obj.testID, figure_obj.actions])
    const sql2 = 'UPDATE Test_Patient SET state_Test_Patient = 1, CompleteDate_Test_Patient = CURRENT_TIMESTAMP WHERE ID_Test_Patient = ?'
    let update = await pool.query(sql2, [figure_obj.testID])
    return figure
}