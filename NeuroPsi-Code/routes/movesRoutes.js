var express  = require('express');
var router = express.Router()
var mMoves = require('../models/movesModel.js');

/*Save moves*/
router.post('/', async function(req,res,next){
    let puzzle_obj = req.body
    let response = await mMoves.saveMoves(puzzle_obj)
    res.status(200).send(response)
})

module.exports = router
