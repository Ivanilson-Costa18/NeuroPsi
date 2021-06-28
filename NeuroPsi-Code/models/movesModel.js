const pool = require('./connection.js');


//Insert moves data to the database
module.exports.saveMoves = async function(puzzle_obj) {
    try {
        const sql = 'INSERT INTO Puzzle_Moves (ID_Test, Puzzle_Moves, Audio_Puzzle) VALUES (?,?,?)'
        await pool.query(sql, [puzzle_obj.ID_Test, puzzle_obj.Moves, puzzle_obj.audio])

        const sql2 = 'UPDATE Test SET Test_State = 1 WHERE ID_Test = ?'
        await pool.query(sql2, [puzzle_obj.ID_Test])
    
        const sql3 = 'INSERT INTO Test_History(ID_Test) VALUES (?)'
        await pool.query(sql3, [puzzle_obj.ID_Test])
    } catch (error) {
        console.log(error)
    }
}