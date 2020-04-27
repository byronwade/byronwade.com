const path = require(`path`)
const { plugins } = require(`./wade.config`)

const { wades_admin_panel } = plugins

module.exports = async ({ actions }) => {
  const { createPage } = actions
      console.log(`Created `+wades_admin_panel.name+` on`)
      createPage({
        path: wades_admin_panel.permalink.base,
        component: wades_admin_panel.entry
      })
}