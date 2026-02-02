const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt= require("jsonwebtoken")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate("user", {username: 1, name: 1})
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(400).json({ error: 'userId missing or not valid' })
    }
    if (!body.title || !body.url) {
        return response.status(400).json({error : "Title and/or url is missing"})
    }

    let blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    if (!blog.likes) {
            blog.likes = 0
        }
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() == user._id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } else {
        response.status(400).json({error : "You can only delete your own blogs"})
    }
})

blogsRouter.put("/:id", async (request, response) => {
    const { title, author, url, likes} = request.body
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }
    blog.title = title ? title : blog.title
    blog.author = author ? author : blog.author
    blog.url = url ? url : blog.url
    blog.likes = likes ? likes : blog.likes

    await blog.save()
    return response.json(blog)
})

module.exports = blogsRouter