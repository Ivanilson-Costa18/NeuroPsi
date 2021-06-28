var express = require('express')
var router = express.Router()
var mMessages = require('../models/messagesModel')

router.post('/', async function(req, res, next){
    let users = req.body
    let messages = await mMessages.getMessages(users.sender, users.receiver)
    res.status(200).send(messages)
})

router.get('/:user', async function(req,res,next){
    let user = req.params.user
    let message = await mMessages.getLastMessage(user)
    res.status(200).send(message)
})

module.exports = router