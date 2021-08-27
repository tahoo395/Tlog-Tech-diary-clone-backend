// dependencies

let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let dotenv = require('dotenv');

// global app object

let app = express();

// middleware setup

app.use(cors())
app.use(express.json())
app.use(cookieParser())
dotenv.config()

// router import

// let home = require('a route')

// router setup

// app.use('/', home)

app.get('/lol', (req, res) => {
    res.end(JSON.stringify({ lol: 'lol' }))
})

// Db setup & build

let dbName = 'Tlog'
let dbUri = `mongodb+srv://tahmid:${process.env.MONGO}@cluster0.8kt6d.mongodb.net/${dbName}`
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    app.listen(8000)
})