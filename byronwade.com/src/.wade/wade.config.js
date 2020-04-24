const path = require(`path`)

module.exports = {
    defaults: {
        title: `Byron Wades Web Development 2`,
        description: `Website Design and Development Firm 2`,
        author: `@byronwade18-2`,
        siteURL: `http://64.225.119.202` //DO NOT ADD A TRAILING SLASH
    },
    theme: {
        enable: true,
        default: 'wade-twenty-twenty'
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
        wade: {
            wade_admin_panel: {
                enable: true,
                theme: 'wade-dark'
            }
        },
        gatsby: [
            {
                resolve: `gatsby-plugin-prefetch-google-fonts`,
                options: {
                    fonts: [
                    {
                        family: `Lato`,
                        variants: ['400','700','900']
                    },
                    {
                        family: `Roboto`,
                        variants: ['400','500','700','900']
                    },
                    ],
                },
            },
            {
                resolve: `gatsby-plugin-manifest`,
                options: {
                    name: `gatsby-starter-default`,
                    short_name: `starter`,
                    start_url: `/`,
                    background_color: `#663399`,
                    theme_color: `#663399`,
                    display: `minimal-ui`,
                    icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
                },
            },
            {
              resolve: "gatsby-source-graphql",
              options: {
                // Arbitrary name for the remote schema Query type
                typeName: "WORDPRESS",
                // Field under which the remote schema will be accessible. You'll use this in your Gatsby query
                fieldName: "wordpress",
                // Url to query from
                url: "http://64.225.119.202/graphql",
                // refetch interval in seconds
                // refetchInterval: 600,
              },
            },
            `gatsby-plugin-react-helmet`,
            {
              resolve: `gatsby-source-filesystem`,
              options: {
                name: `images`,
                path:  path.join(__dirname, `../images`),
              },
            },
            `gatsby-transformer-sharp`,
            `gatsby-plugin-typescript`,
            `gatsby-plugin-sass`,
            `gatsby-plugin-sharp`,
            // {
            //   resolve: 'gatsby-wpgraphql-inline-images',
            //   options: {
            //     wordPressUrl: 'http://64.225.119.202/',
            //     uploadsUrl: 'http://64.225.119.202/wp-content/uploads/',
            //     processPostTypes: ['Page', 'Post'],
            //     graphqlTypeName: 'WORDPRESS',
            //   },
            // },
            // this (optional) plugin enables Progressive Web App + Offline functionality
            // To learn more, visit: https://gatsby.dev/offline
            // `gatsby-plugin-offline`,
        ]
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