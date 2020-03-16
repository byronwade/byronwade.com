const path = require(`path`)
const slash = require(`slash`)
const blocks = require(`./blocks/all`)

module.exports = async ({ actions, graphql }) => {
  const GET_CASES = `
  query GET_CASES($first:Int){
    wordpress {
      caseStudys( first: $first ) {
        nodes {
            blocks {
              isValid
              originalContent
              name
              ${blocks.coreP}
              ${blocks.coreHeading}
            }
            content
            id
            slug
            title
            excerpt
            uri
            date
          }
      }
    }
  }
  `
  const { createPage } = actions

  const fetchPosts = async variables =>
    await graphql(GET_CASES, variables).then(({ data }) => {
      return data.wordpress.caseStudys.nodes
    })

  await fetchPosts({ first: 500 }).then(allPosts => {


    const casesPerPage = 15
    const numberOfPages = Math.ceil(allPosts.length / casesPerPage)
    const blogPostListTemplate = path.resolve('./src/templates/caseStudy.js')
  
    Array.from({length: numberOfPages}).forEach((page, index) => {
        createPage({
            component: slash(blogPostListTemplate),
            path: index === 0 ? '/case-studies' : `/case-studies/${index + 1}`,
            context: {
                cases: allPosts.slice(index * casesPerPage, (index * casesPerPage) + casesPerPage),
                numberOfPages,
                currentPage: index + 1
            }
        })
    })

    allPosts.map(caseStudys => {
      console.log(`Create Cases: ${caseStudys.slug}`)

      actions.createPage({
        path: `/case-studies/${caseStudys.slug}`,
        component: path.resolve(`./src/templates/caseStudyPage.js`),
        context: {
          ...caseStudys,
          id: caseStudys.id,
          slug: caseStudys.slug,
          title: caseStudys.title,
        },
      })
    })
  })
}
