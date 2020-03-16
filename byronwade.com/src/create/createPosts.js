const path = require(`path`)
const slash = require(`slash`)
const blocks = require(`./blocks/all`)

module.exports = async ({ actions, graphql }) => {
  const GET_POSTS = `
  query GET_POSTS($first:Int){
    wordpress {
      posts( first: $first ) {
        nodes {
            blocks {
              isValid
              originalContent
              name
              ${blocks.coreP}
              ${blocks.coreHeading}
            }
            categories {
              nodes {
                name
                slug
                termTaxonomyId
              }
            }
            content
            id
            slug
            title
            uri
            date
          }
      }
    }
  }
  `
  const { createPage } = actions

  const fetchPosts = async variables =>
    await graphql(GET_POSTS, variables).then(({ data }) => {
      return data.wordpress.posts.nodes
    })

  await fetchPosts({ first: 500 }).then(allPosts => {


    const postsPerPage = 15
    const numberOfPages = Math.ceil(allPosts.length / postsPerPage)
    const blogPostListTemplate = path.resolve('./src/templates/blog.js')
  
    Array.from({length: numberOfPages}).forEach((page, index) => {
        createPage({
            component: slash(blogPostListTemplate),
            path: index === 0 ? '/blog' : `/blog/${index + 1}`,
            context: {
                posts: allPosts.slice(index * postsPerPage, (index * postsPerPage) + postsPerPage),
                numberOfPages,
                currentPage: index + 1
            }
        })
    })

    allPosts.map(post => {
      console.log(`Create Post: ${post.slug}`)

      actions.createPage({
        path: `/blog/${post.uri}`,
        component: path.resolve(`./src/templates/post.js`),
        context: {
          ...post,
          id: post.id,
          slug: post.uri,
          title: post.title,
        },
      })
    })
  })
}
