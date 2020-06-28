const path = require(`path`)
module.exports = async ({ actions, graphql }) => {
  const GET_USERS = `
  query GET_USERS($first: Int) {
    wordpress {
      users(first: $first) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          userId
          slug
          uri
        }
      }
    }
  }
  `
  const { createPage } = actions
  const allUsers = []
  const fetchUsers = async variables =>
    await graphql(GET_USERS, variables).then(({ data }) => {
      const {
        wordpress: {
          users: {
            nodes,
            pageInfo: { hasNextPage, endCursor },
          },
        },
      } = data
      nodes.map(user => {
        allUsers.push(user)
      })
      if (hasNextPage) {
        return fetchUsers({ first: 100, after: endCursor })
      }
      return allUsers
    })

  await fetchUsers({ first: 100, after: null }).then(allUsers => {
    const userTemplate = path.resolve(`./src/components/templates/user.js`)

    allUsers.map(user => {
      console.log(`create user: ${user.uri}`)
      createPage({
        path: `/blog${user.uri}`,
        component: userTemplate,
        context: user,
      })
    })
  })
}