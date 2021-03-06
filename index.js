const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const dotenv = require('dotenv')
const {EmailService} = require('./email.service')

dotenv.config()

const whitelist = process.env.CORS_SITES.split(',')
let app  =  express()

// app.use(cors(corsOptions))
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.post('/email/send', async (req, res) => {
    const status = {}
    try {
        await EmailService.sendEmail(req.body)
        status.msg = 'success'
        status.code = 200
    } catch (error) {
        status.msg = `${error.message}`
        status.code = 500
    }

    res.json(status)
})

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Service listen http://0.0.0.0:${port}/`)
})