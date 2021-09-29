const Router = require('express').Router()
const isAuthenticated = require('./isAuthenticated')

const fileUp = require('express-fileupload')
const uploadImage = require('../modules/uploadImage')

Router.use(fileUp())

Router.post('/', uploadImage('assets'))
Router.post('/cover', uploadImage('covers'))
module.exports = Router