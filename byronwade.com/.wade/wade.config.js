const path = require(`path`)

module.exports = {
    defaults: {
        title: `Byron Wades Web Development`,
        description: `Website Design and Development Firm`,
        author: `@byronwade18`,
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
    has: {
        blog: {
            enable: true,
            seo: true,
            permalink: {
                base: `/blog`,
                posts: `Name` //Name (sample-post/), MonthAndName (/2020/04/sample-post/)
            },
        },
        forums: {
            enable: true,
            seo: true,
            permalink: {
                base: `/forums`,
                posts: `Name` //Name (sample-post/), MonthAndName (/2020/04/sample-post/)
            },
        },
        cases: {
            enable: true,
            seo: true,
            permalink: {
                base: `/case-studies`,
                posts: `Name` //Name (sample-post/), MonthAndName (/2020/04/sample-post/)
            },
        },
        works: {
            enable: true,
            seo: true,
            permalink: {
                base: `/works`,
                posts: `Name` //Name (sample-post/), MonthAndName (/2020/04/sample-post/)
            },
        }
    }
}