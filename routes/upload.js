const Router = require('express').Router()
const isAuthenticated = require('./isAuthenticated')

const fileUp = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const imagemin = require('imagemin');
const png = require('imagemin-pngquant');
const jpeg = require('imagemin-mozjpeg');
const gif = require('imagemin-giflossy')
const svg = require('imagemin-svgo')
require('dotenv').config()

Router.use(fileUp())

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

Router.post('/', async (req, res) => {
    try {
        let file = Object.values(req.files)[0]
        let fileNameParts = file.name.split('.')
        let fileExt = fileNameParts[fileNameParts.length-1]
        let filePath = `./uploads/${uuidv4()}.${fileExt}`
        file.mv(filePath)
        await imagemin([filePath], {
            destination: `./uploads/`,
            plugins: [
                png(),
                jpeg(),
                gif(),
                svg()
            ]
        });
        let result = await cloudinary.uploader.upload(filePath)
        fs.unlinkSync(filePath)
        res.json({
            success : 1,
            file: {
                url : result.secure_url
            }
        })
        res.end()
    } catch (err) {
        res.sendStatus(403)
    }
})

Router.get('/', (req, res) => {
    res.send(`<form action="/upload/" method="post" enctype="multipart/form-data">
    <input type="file" name="filetoupload"><br>
    <input type="submit">
  </form>`)
})
module.exports = Router