const path = require(`path`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const GET_PAGES = `
  query GET_PAGES($first:Int $after:String){
    wordpress {
      pages( first: $first after: $after ) {
        nodes {
            blocks {
                isValid
                name
                originalContent
                ${blocks.coreP}
                ${blocks.coreHeading}
            }
            isFrontPage
            title
            uri
            slug
        }
      }
    }
  }
  `

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const { createPage } = actions

  const fetchPages = async variables =>
    await graphql(GET_PAGES, variables).then(({ data }) => {
      return data.wordpress.pages.nodes
    })

  await fetchPages({ first: 500 }).then(allPages => {
    allPages.map(page => {
      console.log(`Create Page: ${page.slug}`)

      const { isFrontPage } = page
      const slug = isFrontPage ? `/` : `/${page.slug}`

      actions.createPage({
        path: slug,
        component: path.resolve(`./src/templates/page.js`),
        context: {
          ...page,
          title: page.title,
        },
      })
    })
  })
}
