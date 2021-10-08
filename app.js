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
    origin: true
}))
app.use(express.json())
app.use(cookieSession({
    keys: [process.env.COOKIE_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    resave: true,
    saveUninitialized: true
}))
dotenv.config()
app.use(passport.initialize())
app.use(passport.session())

// router import

let authRoute = require('./routes/auth.js')
let uploadRoute = require('./routes/upload.js')
let blogs = require('./routes/blogs.js')
let search = require('./routes/search.js')

// router setup

app.use('/auth/', authRoute)
app.use('/upload/', uploadRoute)
app.use('/blogs/', blogs)
app.use('/search/', search)



// Db setup & build
let dbName = 'Tlog'
let dbUri = `mongodb+srv://tahmid:${process.env.MONGO}@cluster0.8kt6d.mongodb.net/${dbName}`
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    app.listen(8000)
})