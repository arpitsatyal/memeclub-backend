let express = require('express')
let mongoose = require('mongoose')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
require('dotenv').config({path: './config.env'})
let authRoutes = require('./routes/authRoutes')

let app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.use((err, req, res, next) => {
    console.log(err)
    console.log('I am error handling middleware')
    let status = err.status || 400
    res.status(status).json(err.msg)
})

let db = process.env.DB
mongoose.connect(db, 
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
).then(() => console.log('db connected!'))

let port = process.env.PORT
app.listen(port, () => console.log('server listening @ '+ port))


