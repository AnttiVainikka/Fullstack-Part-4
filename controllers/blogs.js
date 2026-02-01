const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const logger = require("../utils/logger")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
    let blog = []
    try {
        blog = await Blog.findById(request.params.id)
    } catch (error) {
        return response.status(404).end()
    }
    
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).json({error : "Title and/or url is missing"})
    }

    let blog = new Blog(request.body)

    if (!blog.likes) {
            blog.likes = 0
        }
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete("/:id", async (request, response) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
    } catch (error) {
        logger.error("Invalid id for DELETE request")
    }
    response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
    const { title, author, url, likes} = request.body
    let blog = []
    try {
        blog = await Blog.findById(request.params.id)
    } catch (error) {
        logger.error("Invalid id for PUT request")
        return response.status(404).end()
    }
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