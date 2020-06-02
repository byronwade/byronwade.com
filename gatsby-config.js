const path = require("path");
const wade = require("./src/.wade/wade.config");
require("dotenv").config({
	path: `.env`,
})

module.exports = {
	siteMetadata: {
		title: wade.defaults.title,
		description: wade.defaults.description,
		author: wade.defaults.author,
	},
	plugins: [
		{
			resolve: `gatsby-plugin-prefetch-google-fonts`,
			options: {
				fonts: [
					{
						family: `Lato`,
						variants: ["400", "700", "900"],
					},
					{
						family: `Roboto`,
						variants: ["400", "500", "700", "900"],
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
		{
			resolve: "gatsby-source-graphql",
			options: {
				typeName: "GitHub",
				fieldName: "github",
				url: "https://api.github.com/graphql",
				// HTTP headers
				headers: {
				  // Learn about environment variables: https://gatsby.dev/env-vars
				  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
				},
			  },
		},
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: path.join(__dirname, `src`, `images`),
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
	],
};
