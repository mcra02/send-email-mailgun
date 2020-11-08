const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const dotenv = require('dotenv')
const {EmailService} = require('./email.service')

dotenv.config()

const whitelist = process.env.CORS_SITES.split(',')
let app  =  express()

let corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }

// app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.post('/email/send', cors(corsOptions), async (req, res) => {
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