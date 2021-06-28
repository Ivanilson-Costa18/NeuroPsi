const jwt = require('jsonwebtoken')

const requireAuth = (req,res,next) => {
    const token = req.cookies.cookie4U

    //Check if jwt exists and is verified
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.status(401).send({"redirect": "loginPage.html"})
            } else {
                next();
            }
        })
    } else {
        res.status(401).send({"redirect": "loginPage.html"})
    }
}

module.exports = { requireAuth }