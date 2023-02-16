// // pages/server-sitemap-index.xml/index.tsx
// import { getServerSideSitemapIndex } from "next-sitemap";
// import { GetServerSideProps } from "next";
// import { gql } from "graphql-request";
// import graphQLClient from "../../lib/graphql-client";

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
// 	// Query all blog posts
// 	const query = gql`
// 		query AllBlogPosts {
// 			posts {
// 				edges {
// 					node {
// 						slug
// 					}
// 				}
// 			}
// 		}
// 	`;

// 	const { posts } = await graphQLClient.request(query);

// 	// Map blog post slugs to URLs
// 	const urls = posts.edges.map(
// 		({ node }) => `https://byronwade.com/blog/${node.slug}`
// 	);

// 	return getServerSideSitemapIndex(ctx, urls);
// };

// // Default export to prevent next.js errors
// export default function SitemapIndex() {}
