let mongoose = require('mongoose')

let schema = mongoose.Schema({
    user : Object,
    blogTitle: String,
    blogId: String,
    blogCover: String,
    tags : Array,
    publishTime: String,
    blog: Array,
    html : String,
    comments: Array,
    likes : Array
})

schema.index({ 'user.username': 1, blogTitle : 1, blogId : 1 })

module.exports = mongoose.model('blog' , schema)