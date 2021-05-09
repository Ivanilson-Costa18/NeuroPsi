var express  = require('express');
var router = express.Router()
var mTests = require('../models/testsModel');

/*Get all test types available in the platform*/
router.get('/', async function(req,res,next){
    let tests = await mTests.getAllTests()
    tests.length > 0 ? res.status(200).send(tests) : res.status(404).json({
        "status":404,
        "error":"Not Found",
        "message":"The requested resource does not exist",
        "detail": "There are no tests"
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

/*Send data for test cration*/
router.post('/',async function(req,res,next){
  let newTest = req.body
  let test = await mTests.createTest(newTest);
  res.status(200).send(test)
})

module.exports = router