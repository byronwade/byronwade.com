const path = require(`path`)
const blocks = require(`./blocks/all`)

module.exports = async ({ actions, graphql }) => {
    const GET_TAGS = `
  query GET_TAGS($first:Int){
    wordpress {
        tags( first: $first ) {
        nodes {
            blocks {
                isValid
                name
                originalContent
                ${blocks.coreP}
                ${blocks.coreHeading}
            }
            title
            uri
            slug
        }
      }
    }
  }
  `
    const { createPage } = actions

    const fetchPages = async variables =>
    await graphql(GET_TAGS, variables).then(({ data }) => {
        return data.wordpress.tags.nodes
    })

    await fetchPages({ first: 500 }).then(allPages => {
        allPages.map(tag => {
            console.log(`Create Tags: ${tag.slug}`)
            const uri = `/${tag.uri}`
            actions.createPage({
                path: uri,
                component: path.resolve(`./src/templates/tag.js`),
                context: {
                    ...tag,
                    title: tag.title,
                },
            })
        })
    })
}