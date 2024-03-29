let express = require('express')
let mongoose = require('mongoose')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let io = require('socket.io')
let cors = require('cors')
require('dotenv').config({path: './config.env'})

let authRoutes = require('./routes/authRoutes')
let postRoutes = require('./routes/postRoutes')
let userRoutes = require('./routes/userRoutes')
let messageRoutes = require('./routes/messageRoutes')
let imageRoutes = require('./routes/imageRoutes')

let app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json({limit: '200mb'}))
app.use(express.urlencoded({ limit: '200mb', extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/images', imageRoutes)

app.use((err, req, res, next) => {
    console.log(err)
    console.log('I am error handling middleware')
    let status = err.status || 400
    res.status(status).json(err.msg)
})

// mongoose.connect('mongodb+srv://arpit:okcomputer@cluster0.tf4kb.mongodb.net/mymemeclub?retryWrites=true&w=majority', 
//     {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true
//     }
// ).then(() => console.log('db connected!'))
// .catch(err => console.log(err))

mongoose.connect('mongodb://localhost:27017/memeclub', 
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
).then(() => console.log('db connected!'))
.catch(err => console.log(err))

let server = require('http').createServer(app)
io = io.listen(server)
let { User } = require('./utils/user')
require('./socket/streams')(io, User) 
require('./socket/chat')(io)
server.listen(process.env.PORT || 8080, () => console.log('server listening'))


