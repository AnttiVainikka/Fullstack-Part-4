const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return [...blogs].map(blog => blog.likes).reduce((x,y) => x+y,0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length == 0) {
        return "No blog found"
    }
    const mostLikes = Math.max(...blogs.map(blog => Number(blog.likes)))
    return blogs.find(blog => Number(blog.likes) == mostLikes)
}

const mostBlogs = (blogs) => {
    if (blogs.length == 0) {
        return "No blog found"
    }
    const authorsAndBlogs = [...blogs].map(blog => [blog.author,blogs
        .reduce((blogsAuthored, currentBlog) => 
        (currentBlog.author == blog.author ? blogsAuthored + 1 : blogsAuthored), 0)])
    const mostProfilic = Math.max(...authorsAndBlogs.map(x => x[1]))
    const result = authorsAndBlogs.find(x => x[1] == mostProfilic)
    return {author: result[0], blogs: result[1]}
}

const mostLikes = (blogs) => {
    if (blogs.length == 0) {
        return "No blog found"
    }
    const authorsAndLikes = [...blogs].map(blog => [blog.author,blogs
        .reduce((likesGotten, currentBlog) =>
        (currentBlog.author == blog.author ? likesGotten + currentBlog.likes : likesGotten), 0)])
    const mostLiked = Math.max(...authorsAndLikes.map(x=> x[1]))
    const result = authorsAndLikes.find(x => x[1] == mostLiked)
    return {author: result[0], likes: result[1]}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}