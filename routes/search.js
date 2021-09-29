const Router = require('express').Router()
const Blog = require('../models/blogs')
const fuse = require('fuse.js')

Router.get('/', async (req, res) => {
    let blogs = (await Blog.find({}).select({ 'tags': 1, 'user' : 1, 'blogTitle': 1, 'blogId': 1, 'blogCover' : 1 , 'publishTime' : 1}))
    const Fuse = new fuse(blogs , {keys: ['tags', 'user.name', 'user.username', 'blogTitle']})
    let results = Fuse.search(req.query.q)
    let f = results.map((result) => {
        // res.send(`${result.user.username}/${result.blogTitle}_${result.blogId}`)
        return result.item
    })
    // res.json(results)
    res.json(f)
})

module.exports = Router