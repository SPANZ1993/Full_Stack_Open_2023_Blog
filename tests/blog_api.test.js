// const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')
// const { each } = require('lodash')


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})




describe('creating and retrieving blog entries', () => {

    test('correct number of blogs returned', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })


    test('blogs have id property', async () => {
        const response = await api.get('/api/blogs')
        
        response.body.forEach((blog) => {
            expect(blog['id']).toBeDefined()
        })
    })

    test('new blog is created by post', async () => {

        const newBlog =    {
            title: 'Eggs Taste Good',
            author: 'Egger Djikstra Ferguson',
            url: 'http://www.eggwardo.com',
            likes: 1000,
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const blogsAfterPost = await helper.blogsInDB()
        expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)
    })



    test('if a new blog is created without a likes field then it will default to 0', async () => {

        const newBlog =    {
            title: 'Eggs Taste Good',
            author: 'Egger Djikstra Ferguson',
            url: 'http://www.eggwardo.com',
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        const blogsAfterPost = await helper.blogsInDB()
        const postedBlog = blogsAfterPost.filter(blog => blog.title === 'Eggs Taste Good')[0]
        expect(postedBlog['likes']).toBeDefined()
        expect(postedBlog['likes']).toBe(0)
    })


    test('if a new blog is attempted to be created without a title field then it will return a 400 Bad Request', async () => {

        const newBlog =    {
            // title: 'Eggs Taste Good',
            author: 'Egger Djikstra Ferguson',
            url: 'http://www.eggwardo.com',
            likes: 14
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const blogsAfterAttemptedPost = await helper.blogsInDB()
        expect(blogsAfterAttemptedPost).toHaveLength(helper.initialBlogs.length)
    })



    test('if a new blog is attempted to be created without a url field then it will return a 400 Bad Request', async () => {

        const newBlog =    {
            title: 'Eggs Taste Good',
            author: 'Egger Djikstra Ferguson',
            // url: 'http://www.eggwardo.com',
            likes: 14
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const blogsAfterAttemptedPost = await helper.blogsInDB()
        expect(blogsAfterAttemptedPost).toHaveLength(helper.initialBlogs.length)
    })
})



test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]
  
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
  
    const blogsAtEnd = await helper.blogsInDB()
  
    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )
  
    const title = blogsAtEnd.map(r => r.title)
  
    expect(title).not.toContain(blogToDelete.title)
})


test('a blog cannot be deleted', async () => {
    const badId = await helper.nonExistingId()

    await api
        .delete(`/api/blogs/${badId}`)
        .expect(204)
  
    const blogsAtEnd = await helper.blogsInDB()
  
    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
    )
})



test('attempt to update an existing blog', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToUpdate = blogsAtStart[0]

    const newBlog =    {
        title: 'Eggs Taste REALLY Good',
        author: 'Eggerino Djikstra Ferguson',
        url: 'http://www.eggwardicon.com',
        likes: 1000000
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200)


    const blogsAtEnd = await helper.blogsInDB()
    const updatedBlog = blogsAtEnd.filter(blog => blog['id'] === blogToUpdate['id'])[0]
    for (const prop in newBlog){
        expect(newBlog[prop]).toBe(updatedBlog[prop])
    }
})


test('attempt to update a non-existing blog', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const badId = await helper.nonExistingId()

    const newBlog =    {
        title: 'Eggs Taste Alright',
        author: 'Egg Guy',
        url: 'http://www.geocities.com/Eggville/6969',
        likes: 0
    }

    await api
        .put(`/api/blogs/${badId}`)
        .send(newBlog)
        .expect(404)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    for(let i=0; i<blogsAtStart.length; i+=1){
        expect(blogsAtStart).toContainEqual(blogsAtEnd[i])
    }
})