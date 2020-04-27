const path = require(`path`)

module.exports = {
    defaults: {
        title: `Byron Wades Web Development 2`,
        description: `Website Design and Development Firm 2`,
        author: `@byronwade18-2`,
        siteURL: `http://64.225.119.202`,
        permalinks: {
            base: `/__admin`,
            posts: `Slug`  //Slug (base/sample-post/), MonthAndSlug (base/2020/04/sample-post/)
        }
    },
    theme: {
        enable: true,
        default: 'wades-twenty-twenty'
    },
    social: {
        facebook: {
            appId: process.env.FACEBOOK_APP_ID,
            appSecret: process.env.FACEBOOK_APP_SECRET
        },
        twitter: {
            appId: 'APP-ID-HERE',
            appSecret: 'APP-SECRET-HERE'
        },
        github: {
            appId: 'APP-ID-HERE',
            appSecret: 'APP-SECRET-HERE'
        },
        dribbble: {
            appId: 'APP-ID-HERE',
            appSecret: 'APP-SECRET-HERE'
        }
    },
    plugins: {
        wades_admin_panel: {
            name: `Wades Admin Panel`,
            enable: true,
            theme: 'wade-dark',
            entry: path.resolve(`./src/.wade/wades-admin/index.js`),
            permalink: {
                base: `/__admin`
            },
        }
    }
}