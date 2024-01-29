const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    return response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const allowedProperties = ['title', 'author', 'url', 'likes']
    const blog = {}

    allowedProperties.forEach(prop => {
        if (Object.prototype.hasOwnProperty.call(body, prop)){
            blog[prop] = body[prop]
        }
    })

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog, 
        {
            new: true,
            runValidators: true,
            context: 'query'
        }
    )

    if (updatedBlog === null){
        response.status(404).end()
    }
    response.json(updatedBlog)
    
})

module.exports = blogsRouter