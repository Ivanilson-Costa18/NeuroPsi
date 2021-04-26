const pool = require('./connection')

module.exports.saveFigure = async function(figure_obj){
    const sql = 'INSERT INTO Figure(ID_TestPatient, FigureJSON) VALUES (?,?)'
    let figure = await pool.query(sql, [figure_obj.testID, figure_obj.figureActions])
    return figure
}