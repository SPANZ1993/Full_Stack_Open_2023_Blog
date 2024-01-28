const mongoose = require('mongoose')
const {MONGODB_URI} = require('../utils/config')

// const mongoUrl = 'mongodb://localhost/bloglist'
const mongoUrl = MONGODB_URI


mongoose.connect(mongoUrl)
    .then(
        () => {console.log('Connected to MongoDB')}
    )
    .catch(
        error => {console.log('Error connecting to MongoDB:', error.message)}
    )






const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// const Blog = mongoose.model('Blog', blogSchema)

module.exports = mongoose.model('Blog', blogSchema)