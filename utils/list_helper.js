const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

  
const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + (blog['likes'] ? blog['likes'] : 0), 0)

const favoriteBlog = (blogs) => {
    const max_likes = Math.max.apply(Math, blogs.map(blog => blog['likes'] ? blog['likes'] : 0))
    for (let i = 0; i < blogs.length; i++){
        if ((blogs[i]['likes'] ? blogs[i]['likes'] : 0) === max_likes){
            return {
                'title': blogs[i]['title'],
                'author': blogs[i]['author'],
                'likes': blogs[i]['likes']
            }
        }
    }
}

const mostBlogs = (blogs) => {
    const authnum = _.toPairs(_.countBy(blogs, blog => blog['author']))
    const most = _.maxBy(authnum, an => an[1])
    return {'author': most[0], 'blogs': most[1]}
}

const mostLikes = (blogs) => {
    const auth2blogs = _.groupBy(blogs, blog => blog['author'])
    const authnum = _.toPairs(
        _.mapValues(auth2blogs, blogs => 
            blogs.reduce((sum, blog) => sum + (blog['likes'] ? blog['likes'] : 0), 0)
        )
    )
    const most = _.maxBy(authnum, an => an[1])
    return {'author': most[0], 'likes': most[1]}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}