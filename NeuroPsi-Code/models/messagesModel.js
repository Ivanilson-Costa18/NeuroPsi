var pool = require('./connection')

module.exports.getMessages = async (sender, receiver) => {
    const sql = 'SELECT * FROM Message WHERE Receiver_ID_Message = ? AND Sender_ID_Message = ? OR Receiver_ID_Message = ? AND Sender_ID_Message = ?'
    let messages = await pool.query(sql, [receiver, sender, sender, receiver])
    return messages
}

module.exports.getLastMessage = async (user) => {
    const sql = 'SELECT * FROM `Message` WHERE Message.Receiver_ID_Message = ? OR Sender_ID_Message = ? ORDER BY Date_Time_Message DESC LIMIT 1'
    let message = await pool.query(sql,[user,user])
    return message
}