const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs", {title: 1, author: 1, url: 1, likes: 1})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.put("/:id", async (request, response) => {
    const body = request.body
    const user = await User.findById(request.params.id)
    if (!user) {
        return response.status(404).end()
    }
    user.username = body.username ? body.username : user.username
    user.name = body.name ? body.name : user.name
    user.blogs = body.blogs ? body.blogs : user.blogs

    await user.save()
    return response.json(user)
})

module.exports = usersRouter