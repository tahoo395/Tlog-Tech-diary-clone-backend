const Router = require('express').Router()
const Blog = require('../models/blogs')
const { uid } = require('uid')
const isAuthenticated = require('./isAuthenticated')
let editorToHtml = require('../modules/editorToHtml')

// Blog route

Router.get('/:chunk', async (req, res) => {
    let blogs = await Blog.find({}).sort({publishTime : -1}).limit(4).skip(req.params.chunk * 4 - 4).select({user : 1,blogTitle : 1,blogCover : 1,publishTime:1 , blogId : 1})
    res.json(blogs)
})


// Blog specific routes


Router.post(`/newBlog/`, async (req, res) => {
    if (req.body.blog.length && req.body.tags.length && req.body.blogCover && req.body.blogTitle) {
        let blog = await new Blog({
            user: req.user,
            blogTitle: req.body.blogTitle,
            blogId: uid(10),
            blogCover: req.body.blogCover,
            tags: req.body.tags,
            publishTime: (new Date).getTime(),
            blog: req.body.blog,
            html: editorToHtml(req.body.blog),
            comments: [],
            likes: [],
        }).save()

        res.json(blog)
    }
    else {
        console.log('wtf')
    }
})

Router.get('/blog/:user/:blog', async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    let blogDoc = await Blog.findOne({ 'user.username': username, blogTitle, blogId }).select({ html: 1, user: 1, blogCover: 1, publishTime: 1, _id: 0 }).lean()

    if (blogDoc) {
        res.json(blogDoc)
    }
    else {
        res.json({ message: 'Blog not found' })
    }
})

// edit blog

Router.get('/blog/edit/:user/:blog', async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    let blogDoc = await Blog.findOne({ 'user.username': username, blogTitle, blogId }).select({ blog: 1, user: 1, blogCover: 1, publishTime: 1, tags : 1, _id: 0 }).lean()

    if (blogDoc) {
        res.json(blogDoc)
    }
    else {
        res.json({ message: 'Blog not found' })
    }
})

Router.post('/blog/edit/:user/:blog' , async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    await Blog.updateOne({ 'user.username': username, blogTitle, blogId }, {
        blogTitle: req.body.blogTitle,
        blog: req.body.blog,
        html: editorToHtml(req.body.blog),
        blogCover: req.body.blogCover,
        tags: req.body.tags,
    })

    res.end()
})

// delete routes

Router.delete('/blog/delete/:user/:blog' , async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    await Blog.deleteOne({ 'user.username': username, blogTitle, blogId })
    res.end()
})


// comment routes


Router.post('/comment/:user/:blog', async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    let comment = { user: req.user, text: req.body.text, publishTime: (new Date).getTime(), id: uid(7) }

    await Blog.updateOne(
        { 'user.username': username, blogTitle, blogId },
        {
            $push: {
                comments: {
                    $each: [comment],
                    $position: 0
                }
            }
        }
    )

    res.json(comment)
})

Router.get('/comment/:user/:blog/:chunk', async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    let comments = await Blog.findOne({ 'user.username': username, blogTitle, blogId }, { comments: { $slice: [req.params.chunk * 4 - 4, 4] } }).select({ tags: 0, blog: 0, html: 0, likes: 0, _id: 0, user: 0, blogTitle: 0, blogId: 0, blogCover: 0, publishTime: 0, __v: 0 })
    res.json(comments.comments)
})

Router.delete('/comment/:user/:blog/:id', async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    await Blog.updateOne(
        { 'user.username': username, blogTitle, blogId, 'comments.id': req.params.id },
        {
            $pull: {
                comments: { id: req.params.id }
            }
        }
    )

    res.end()
})


Router.put('/comment/:user/:blog/:id', async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    await Blog.updateOne(
        { 'user.username': username, blogTitle, blogId, 'comments.id': req.params.id },
        {
            'comments.$.text': req.body.text
        }
    )

    res.end()
})


// reaction routes

Router.post('/reactions/:user/:blog/inc', async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    await Blog.updateOne(
        { 'user.username': username, blogTitle, blogId },
        {
            $push: {
                likes: req.user._id
            }
        }
    )

    res.end()
})

Router.post('/reactions/:user/:blog/dec', async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    await Blog.updateOne(
        { 'user.username': username, blogTitle, blogId },
        {
            $pull: {
                likes: req.user._id
            }
        }
    )

    res.end()
})

Router.get('/reactions/:user/:blog', async (req, res) => {
    let username = req.params.user

    let blogTitle = req.params.blog.split('_')[0].replace('%20', ' ')
    let blogId = req.params.blog.split('_')[1]

    let likes = await Blog.findOne(
        { 'user.username': username, blogTitle, blogId }
    ).select('likes').lean()

    res.json(likes.likes)
})

module.exports = Router