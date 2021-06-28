var express  = require('express');
var router = express.Router()
var mTests = require('../models/testsModel');

/*Get all test types available in the platform*/
router.get('/', async function(req,res,next){
    let tests = await mTests.getAllTestsTypes()
    tests.length > 0 ? res.status(200).send(tests) : res.status(404).json({
        "error":"Not Found",
        "message":"The requested resource does not exist",
        "detail": "0 tests available"
      });
})

/*Get figure associated with the test*/
router.get('/:testID/figures', async function(req, res, next){
  let id_test = req.params.testID
  let figure = await mTests.getFigure(id_test)
  figure.length > 0 ? res.status(200).send(figure) : res.status(404).json({
    "status":404,
    "error":"Not Found",
    "message":"The requested resource does not exist",
    "detail": "This test does not contain figures"
  });
})

/*Get figure associated with the test*/
router.get('/:testID/moves', async function(req, res, next){
  let id_test = req.params.testID
  let moves = await mTests.getMoves(id_test)
  moves.length > 0 ? res.status(200).send(moves) : res.status(404).json({
    "error":"Not Found",
    "message":"The requested resource does not exist",
    "detail": "This test does not contain moves"
  });
})

/*Get recent solve tests*/
router.get('/testshistory/:doc_id', async function(req,res,next){
  let doc_id = req.params.doc_id
  let tests = await mTests.getRecentSolvedTests(doc_id)
  res.status(200).send(tests)
})

module.exports = router