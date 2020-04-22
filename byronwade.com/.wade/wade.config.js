const path = require(`path`)

module.exports = {
    defaults: {
        title: `Byron Wades Web Development`,
        description: `Website Design and Development Firm`,
    },
    has: {
        blog: {
            enable: true,
            seo: true,
            permalink: {
                base: `/blog`,
                posts: `PostName` //PostName (sample-post/), MonthAndName (/2020/04/sample-post/)
            },
        },
        forums: {
            enable: true,
            seo: true,
            permalink: {
                base: `/forums`,
                posts: `PostName` //PostName (sample-post/), MonthAndName (/2020/04/sample-post/)
            },
        },
        cases: {
            enable: true,
            seo: true,
            permalink: {
                base: `/case-studies`,
                posts: `PostName` //PostName (sample-post/), MonthAndName (/2020/04/sample-post/)
            },
        },
        works: {
            enable: true,
            seo: true,
            permalink: {
                base: `/works`,
                posts: `PostName` //PostName (sample-post/), MonthAndName (/2020/04/sample-post/)
            },
        }
    }
}