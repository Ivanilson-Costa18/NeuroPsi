var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var patientsRouter = require('./routes/patientsRoutes');
var doctosrRouter = require('./routes/doctorsRoutes');
var testsRouter = require('./routes/testsRoutes');
var figuresRouter = require('./routes/figureRoutes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctosrRouter);
app.use('/api/tests', testsRouter);
app.use('/api/figures', figuresRouter);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    res.send(error.message)
})

module.exports = app;
