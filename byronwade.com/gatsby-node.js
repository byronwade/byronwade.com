/* --------- Programatically Create Image Nodes --------- */
// const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

// exports.createResolvers = ({
//   actions,
//   cache,
//   createNodeId,
//   createResolvers,
//   store,
//   reporter,
// }) => {
//   const { createNode } = actions
//   createResolvers({
//     WORDPRESS_MediaItem: {
//       imageFile: {
//         type: `File`,
//         resolve(source, args, context, info) {
//           return createRemoteFileNode({
//             url: source.mediaItemUrl,
//             store,
//             cache,
//             createNode,
//             createNodeId,
//             reporter,
//           })
//         },
//       },
//     },
//   })
// }

/* --------- Programatically Create Pages --------- */

//const createCases = require(`./src/create/createCases`)
const createPages = require(`./src/create/createPages`)
//const createWorks = require(`./src/create/createWorks`)
//const createAuthors = require(`./src/create/createAuthors`)
//const createTags = require(`./src/create/createTags`)
//const createCategories = require(`./src/create/createCategories`)
//const createPosts = require(`./src/create/createPosts`)

exports.createPages = async ({ actions, graphql }) => {
  //await createCases({ actions, graphql })
  await createPages({ actions, graphql })
  //await createWorks({ actions, graphql })
  //await createAuthors({ actions, graphql })
  //await createTags({ actions, graphql })
  //await createCategories({ actions, graphql })
  //await createPosts({ actions, graphql })
}