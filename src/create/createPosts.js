const path = require(`path`)
module.exports = async ({ actions, graphql }) => {
  const GET_POSTS = `
  query GET_POSTS($first:Int $after:String){
    wordpress {
      posts(first: $first after:$after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          id
          uri
          slug
          postId
          title
        }
      }
      page(idType: URI, id: "/blog/") {
        id
        uri
        pageId
        title
        seo {
          title
          metaDesc
          focuskw
        }
      }
    }
  }
  `
  const { createPage } = actions
  console.log('ACTIONS', createPage)
  const allPosts = []
  const blogPages = []
  let pageNumber = 0
  const fetchPosts = async variables =>
    await graphql(GET_POSTS, variables).then(({ data }) => {
      const {
        wordpress: {
          posts: {
            nodes,
            pageInfo: { hasNextPage, endCursor },
          },
        },
      } = data

      const nodeIds = nodes.map(node => node.postId)
      const blogTemplate = path.resolve(`./src/components/templates/blog.js`)
      const blogPagePath = pageNumber === 0 ? `/blog/` : `/blog/${pageNumber}`

      blogPages.push({
        path: blogPagePath,
        component: blogTemplate,
        context: {  
          ids: nodeIds,
          pageInfo: data,
          pageNumber: pageNumber,
          hasNextPage: hasNextPage,
        },
        ids: nodeIds,
      })
      nodes.map(post => {
        allPosts.push(post)
      })
      if (hasNextPage) {
        pageNumber++
        return fetchPosts({ first: 12, after: endCursor })
      }
      return allPosts
    })

  await fetchPosts({ first: 12 }).then(allPosts => {

    blogPages.map(blogPage => {
      //console.log(`createBlogPage ${blogPage.context.pageNumber}`)
      createPage(blogPage)
    })
    
    allPosts.map(post => {
      //console.log(`create post: ${post.slug}`)
      createPage({
        path: `/blog/${post.slug}/`,
        component: path.resolve(`./src/components/templates/post.js`),
        context: post,
      })
    })
    
  })

}