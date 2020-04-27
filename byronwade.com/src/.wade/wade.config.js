const path = require(`path`)

module.exports = {
    defaults: {
        title: `Byron Wades Web Development 2`,
        description: `Website Design and Development Firm 2`,
        author: `@byronwade18-2`,
        siteURL: `http://64.225.119.202`
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
                base: `/__admin`,
            },
        }
    },
    has: {
        //Blog enabled from wordpress site on a specific url
        blog: {
            enable: true,
            seo: true,
            permalink: {
                base: `/blog`,
                posts: `Slug` //Slug (base/sample-post/), MonthAndSlug (base/2020/04/sample-post/)
            },
            morePosts: {
                facebook: {
                    enabled: true //this enables facebook page posts inside your blog
                },
                rss: {
                    enabled: true //this enabled rss feeds inside your blogs
                }
            }
        },
        //forums for websites - Wordpress Plugin used would be BBPress
        forums: {
            enable: true,
            seo: true,
            permalink: {
                base: `/forums`,
                posts: `Slug` //Slug (base/sample-post/), MonthAndSlug (base//2020/04/sample-post/)
            },
        },
        //case studies for websites
        cases: {
            enable: true,
            seo: true,
            permalink: {
                base: `/case-studies`,
                posts: `Slug` //Slug (base/sample-post/), MonthAndSlug (base/2020/04/sample-post/)
            },
        },
        //works would be like a profile
        works: {
            enable: true,
            seo: true,
            permalink: {
                base: `/works`,
                posts: `Slug` //Slug (base/sample-post/), MonthAndSlug (base/2020/04/sample-post/)
            },
        }
    }
}