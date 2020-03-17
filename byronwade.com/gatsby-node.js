/* --------- Programatically Create Pages --------- */
const createPages = require(`./src/create/createPages`)
const createCases = require(`./src/create/createCases`)
const createWorks = require(`./src/create/createWorks`)
const createUsers = require(`./src/create/createUsers`)
const createTags = require(`./src/create/createTags`)
const createCategories = require(`./src/create/createCategories`)
const createPosts = require(`./src/create/createPosts`)

exports.createPages = async ({ actions, graphql }) => {
  await createPages({ actions, graphql })
  await createCases({ actions, graphql })
  await createWorks({ actions, graphql })
  await createUsers({ actions, graphql })
  await createTags({ actions, graphql })
  await createCategories({ actions, graphql })
  await createPosts({ actions, graphql })
}



/* --------- Programatically Create Image Nodes --------- */
// const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

// exports.createResolvers = async ({actions, cache, createNodeId, createResolvers, store, reporter}) => {
//   const { createNode } = actions

//   await createResolvers({
//     WORDPRESS_MediaItem: {
//       imageFile: {
//         type: "File",
//         async resolve(source) {
//           let sourceUrl = source.sourceUrl

//           if (source.mediaItemUrl !== undefined) {
//             sourceUrl = source.mediaItemUrl
//           }

//           return await createRemoteFileNode({
//             url: encodeURI(sourceUrl),
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