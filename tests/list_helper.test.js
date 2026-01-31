const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require("./testBlogs")

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]])
    assert.strictEqual(result, 7)
  })

  test("with many blogs in a list returns combined like total", () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
  test("returns 0 when given empty list", () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {

    test('when list has only one blog returns that blog', () => {
        const result = listHelper.favoriteBlog([blogs[0]])
        assert.deepStrictEqual(blogs[0],result)
    })

    test("when given a large list of blogs, returns the blog with the most likes", () => {
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(blogs[2],result)
    })
    test("returns 'No blog found' when given empty list", () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual("No blog found",result)
      })

})

describe("most blogs", () => {

    test("when list has only one blog returns the blogs author and 1", () => {
        const result = listHelper.mostBlogs([blogs[0]])
        assert.deepStrictEqual(result, {author: "Michael Chan", blogs: 1})
    })

    test("when given a large list of blogs, returns the author with most blogs with the total", () => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result,{author: "Robert C. Martin",blogs: 3})
    })

    test("returns 'No blog found' when given empty list", () => {
        const result = listHelper.mostBlogs([])
        assert.strictEqual("No blog found",result)
      })
})

describe("most likes", () => {

    test("when list has only one blog returns the blogs author and its likes", () => {
        const result = listHelper.mostLikes([blogs[0]])
        assert.deepStrictEqual(result, {author: "Michael Chan", likes: 7})
    })

    test("when given a large list of blogs, returns the author with most likes with the total", () => {
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result,{author: "Edsger W. Dijkstra",likes: 17})
    })

    test("returns 'No blog found' when given empty list", () => {
        const result = listHelper.mostLikes([])
        assert.strictEqual("No blog found",result)
      })
})