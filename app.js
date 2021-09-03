// dependencies

let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let dotenv = require('dotenv');
let cookieSession = require('cookie-session');
let passport = require('passport')
require('./strategies/github');
require('./strategies/google');

// global app object

let app = express();

// middleware setup

app.use(cors({
    credentials: true,
}))
app.use(express.json())
app.use(cookieSession({
    keys: [process.env.COOKIE_SECRET],
    maxAge: 24 * 60 * 60 * 1000
}))
dotenv.config()
app.use(passport.initialize())
app.use(passport.session())

// router import

let authRoute = require('./routes/auth.js')
let uploadRoute = require('./routes/upload.js')

// router setup

app.get('/', (req, res) => {
    res.end('<a href="/auth/google">Login</a>')
})

app.use('/auth/', authRoute)
app.use('/upload/' , uploadRoute)



// Db setup & build

let dbName = 'Tlog'
let dbUri = `mongodb+srv://tahmid:${process.env.MONGO}@cluster0.8kt6d.mongodb.net/${dbName}`
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    app.listen(8000)
})