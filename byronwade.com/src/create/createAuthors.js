const path = require(`path`)

module.exports = async ({ actions, graphql }) => {
  const GET_AUTHORS = `
  query GET_AUTHORS($first:Int){
    wordpress {
      users( first: $first ) {
        nodes {
            id
            slug
            uri
            name
          }
      }
    }
  }
  `
  const { createPage } = actions

  const fetchPosts = async variables =>
    await graphql(GET_AUTHORS, variables).then(({ data }) => {
      return data.wordpress.users.nodes
    })

  await fetchPosts({ first: 500 }).then(allPosts => {

    allPosts.map(author => {
      console.log(`Create Authors: ${author.slug}`)

      actions.createPage({
        path: `/author/${author.slug}`,
        component: path.resolve(`./src/templates/author.js`),
        context: {
          ...author,
          id: author.id,
          slug: author.uri,
          title: author.title,
        },
      })
    })
  })
}
