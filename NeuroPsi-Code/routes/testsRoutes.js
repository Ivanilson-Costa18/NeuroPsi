var express  = require('express');
var router = express.Router()
var mTests = require('../models/testsModel');

router.get('/', async function(req,res,next){
    let tests = await mTests.getAllTests()
    tests.length > 0 ? res.status(200).send(tests) : res.status(404).json({
        "status":404,
        "error":"Not Found",
        "message":"The requested resource does not exist",
        "detail": "There are no tests"
      });
})

module.exports = router