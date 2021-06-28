var express  = require('express');
var router = express.Router()
var mUsers = require('../models/usersModel')

router.get('/:id_user', async function(req,res,next){
    let id_user = req.params.id_user;
    let user = await mUsers.getUser(id_user);
    res.status(200).send(user)
}) 

module.exports = router