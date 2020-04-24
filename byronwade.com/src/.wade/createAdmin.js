const path = require(`path`)
module.exports = async ({ actions }) => {
  const { createPage } = actions
      console.log(`created admin panel`)
      createPage({
        path: `/__admin`,
        component: path.resolve(`./src/.wade/wades-admin/index.js`)
      })
}