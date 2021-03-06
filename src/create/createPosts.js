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

      blogPages[pageNumber] = {
        path: pageNumber === 0 ? `/blog/` : `/blog/${pageNumber}`,
        component: path.resolve(`./src/components/templates/blog.js`),
        context: {
          ids: nodeIds,
          pageInfo: data,
          pageNumber: pageNumber,
          hasNextPage,
        },
        ids: nodeIds,
      }

      nodes.map(post => {
        allPosts.push(post)
      })

      if (hasNextPage) {
        pageNumber++
        return fetchPosts({ first: 13, after: endCursor })
      }

      return allPosts
    })

  await fetchPosts({ first: 13, after: null }).then(allPosts => {

    blogPages.map(blogPage => {
      //console.log(blogPage)
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