var express = require('express')
var router = express.Router()
var mFigures = require('../models/figuresModel')

/*Save figure data*/
router.post('/', async function(req,res,next){
    let newFigure = req.body
    let figure = await mFigures.saveFigure(newFigure)
    res.status(200).send(figure) 
})

router.get('/:id_figure', async function(req,res,next){
    let id = req.params.id_figure
    let figure = await mFigures.getDefautlFigure(id)
    res.status(200).send(figure)
})

module.exports = router