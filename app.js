require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')


const middleware = require('./utils/middleware')


app.use(cors())
app.use(express.json())

const blogsRouter = require('./controllers/blogs')


app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app