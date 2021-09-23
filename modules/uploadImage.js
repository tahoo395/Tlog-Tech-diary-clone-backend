const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const cloudinary = require('cloudinary').v2

const imagemin = require('imagemin');
const png = require('imagemin-pngquant');
const jpeg = require('imagemin-mozjpeg');
const gif = require('imagemin-giflossy')
const svg = require('imagemin-svgo')

const {extname} = require('path')

require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


module.exports = (folder) => {
    return async (req, res) => {
        try {
            let file = Object.values(req.files)[0]
            let fileExt = extname(file.name)
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
            let result = await cloudinary.uploader.upload(filePath, { folder })
            fs.unlinkSync(filePath)
            res.json({
                success: 1,
                file: {
                    url: result.secure_url,
                    name: file.name,
                }
            })
            res.end()
        } catch (err) {
            res.sendStatus(403)
        }
    }
}