var express = require('express')
var router = express.Router
var mFigures = require('../models/figuresModel')

router.post('/', async function(req,res,next){
    let newFigure = req.body
    let figure = await mFigures.saveFigure(newFigure)
    res.status(200).send(figure) 
})

module.exports = router