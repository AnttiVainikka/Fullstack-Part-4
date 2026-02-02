const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogs = require("./testBlogs")
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
})

describe('GET request to /api/blogs', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('correct amount of blogs is returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length,blogs.length)
    })

    test('returned blogs have parameter "id"', async () => {
        const response = await api.get('/api/blogs')
        assert.notStrictEqual(response.body[0].id,undefined)
    })
})

describe('POST request to /api/blogs', () => {

    test("POSTing blog increases blog count by one and new blog can be found", async () => {
        const newBlog = {
            title: "POST it",
            author: "POSTER",
            url: "jospa",
            likes: 44
        }

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get("/api/blogs")
        const titles = response.body.map(blog=> blog.title)
        assert.strictEqual(response.body.length, blogs.length + 1)
        assert(titles.includes("POST it"))
    })

    test("POSTing blog without given like value defaults likes to 0", async () => {
        const likelessBlog = {
            title: "No likes, sad",
            author: "Eppu Epäsuosittu",
            url: "lonely"
        }
        await api.post("/api/blogs").send(likelessBlog)
        const response = await api.get("/api/blogs")
        const addedBlog = response.body.filter((blog) => blog.author == "Eppu Epäsuosittu")[0]
        assert.strictEqual(addedBlog.likes, 0)
        })
    
    test ("POSTing blog without title or url returns 400 Bad Request and no blog is added", async () => {

        const titlelessBlog = {
            author: "POSTER",
            url: "jospa",
            likes: 44
        }
        const urlessBlog = {
            title: "POST it",
            author: "POSTER",
            likes: 44
        }
        
        await api
            .post("/api/blogs")
            .send(titlelessBlog)
            .expect(400)
        
        await api
            .post("/api/blogs")
            .send(urlessBlog)
            .expect(400)
        
        const response = await api.get("/api/blogs")
        assert.strictEqual(response.body.length, blogs.length)
    })
})

describe('DELETE request to /api/blogs/id', () => {

    test('DELETE request with correct id deletes blog and returns 204', async () => {
        await api
            .delete(`/api/blogs/${blogs[0]._id}`)
            .expect(204)

        const response = await api.get("/api/blogs")
        assert.strictEqual(response.body.length, blogs.length - 1)
        const titles = response.body.map(blog=> blog.title)
        assert(!titles.includes("React patterns"))
    })

    test("DELETE request with invalid id doesn't crash system and returns 400", async () => {
        await api
            .delete(`/api/blogs/asdfasdfsd`)
            .expect(400)
    })
})

describe('PUT request to /api/blogs/id', () => {

    test('PUT request successfully updated blog when all values are given and returns the blog', async () => {
        const updatedValues = {
            title: "Python patterns",
            author: "Cobra Chan",
            url: "https://pythonpatterns.com/",
            likes: 76
        }
        const updatedBlog = await api.put(`/api/blogs/${blogs[0]._id}`).send(updatedValues)
        const response = await api.get("/api/blogs")
        const result = response.body.filter((blog) => blog.id == blogs[0]._id)[0]
        assert.deepStrictEqual(updatedBlog.body,result)
        assert.strictEqual("Python patterns",result.title)
    })

    test('PUT request successfully updated blog when only likes are given', async () => {
        const updatedLikes = {
            likes: 67
        }
        await api.put(`/api/blogs/${blogs[0]._id}`).send(updatedLikes)
        const response = await api.get("/api/blogs")
        const result = response.body.filter((blog) => blog.id == blogs[0]._id)[0]
        assert.deepStrictEqual(67,result.likes)
    })

    test("PUT request with missing id returns 404 and invalid id returns 400", async () => {
        await api
            .put(`/api/blogs/asdfasdfsd`)
            .send({likes: 67})
            .expect(400)
        await api
            .put(`/api/blogs/5a422a851b54a676534d17f7`)
            .send({likes: 67})
            .expect(404)
    })
})

after(async () => {
  await mongoose.connection.close()
})