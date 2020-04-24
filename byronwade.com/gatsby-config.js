const wade = require(`./src/.wade/wade.config`)

module.exports = {
  siteMetadata: {
    title: wade.defaults.title,
    description: wade.defaults.description,
    author: wade.defaults.author,
  },
  plugins: wade.plugins.gatsby
}

console.log(module.exports.plugins)