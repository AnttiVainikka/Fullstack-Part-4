const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body.title || !body.url) {
        return response.status(400).json({error : "Title and/or url is missing"})
    }

    const user = await User.findById(body.userId)
    if (!user) {
        return response.status(400).json({ error: 'userId missing or not valid' })
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
    await Blog.findByIdAndDelete(request.params.id)
    //const user = await User.findById(body.userId)
    response.status(204).end()
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