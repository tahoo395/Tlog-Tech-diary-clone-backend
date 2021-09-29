let mongoose = require('mongoose')

let schema = mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name : String,
    username: String,
    profilePic : String,
})

module.exports = mongoose.model('user' , schema)