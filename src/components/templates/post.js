//Import for code parts of react and gatsby
import React from "react"; //reacts core
import { graphql } from "gatsby"; //gatsbys graphql setup
import ReactHtmlParser from "react-html-parser"; //parse html
import moment from "moment/moment"; //date formatting
import Img from "gatsby-image"; //gatsby image API
import { Helmet } from "react-helmet"

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links
import SEO from "../utils/seo"; //adding SEO

//Import Blocks
import BlockList from "../blocks/BlockList";

//Import Layout for pages
import Layout from "../body/layout";

const Post = (props) => {
	const {
		data: {
			wordpress: { post, allSettings },
		},
	} = props;
	const {
		title,
		content,
		date,
		excerpt,
		author,
		readingTime,
		featuredImage,
		seo,
		link,
		blocks,
	} = post;
	const { generalSettingsTitle } = allSettings


    const Article = {
		"@context": "https://schema.org/",
		"@type": "Article",
		"headline": title,
		"image": {
		  "@type": "ImageObject",
		  "url": featuredImage && featuredImage.imageFile ? featuredImage.sourceUrl : null,
		  "width": `"${featuredImage && featuredImage.imageFile ? featuredImage.mediaDetails.width : null}px"`,
		  "height": `"${featuredImage && featuredImage.imageFile ? featuredImage.mediaDetails.height : null}px"`
		},
		"author": {
		  "@type": "Person",
		  "name": author.name
		},
		"publisher": {
		  "@type": "Organization",
		  "name": generalSettingsTitle,
		  "logo": {
			"@type": "ImageObject",
			"url": author && author.avatar ? author.avatar.url : null,
			"width": `"${author && author.avatar ? author.avatar.width : null}px"`,
			"height": `"${author && author.avatar ? author.avatar.height : null}px"`
		  }
		},
		"datePublished": moment(date).format(`MMM Do YYYY`)
	};

	return (
		<Layout>
        	<Helmet><script type="application/ld+json">{JSON.stringify(Article)}</script></Helmet>
			<SEO title={seo.title} description={seo.metaDesc} /*image={featuredImage.link ? featuredImage.link : null}*/ url={link ? link : null} robots='index, follow' />

			{featuredImage && featuredImage.imageFile ? (
				<Img fluid={featuredImage.imageFile.childImageSharp.fluid} alt='Gatsby Docs are awesome' />
			) : null}

			<h1>{ReactHtmlParser(title)}</h1>

			<img src={author.avatar.url} alt={`Author - ${author.name}`} />
			<div><small>{moment(date).format(`MMM Do YYYY`)}</small></div>
			<div><small>{author.name}</small></div>
			<div><small>Reading Time: {readingTime}</small></div>

			<BlockList blocks={blocks} content={content} />
		</Layout>
	);
};

export default Post;

export const pageQuery = graphql`
	query GET_POST($id: ID!) {
		wordpress {
			allSettings {
			  generalSettingsTitle
			}
			post(id: $id) {
				title
				content
				uri
				link
				excerpt
				date
				readingTime
				featuredImage {
					sourceUrl(size: LARGE)
					mediaDetails {
					  height
					  width
					}
					mediaItemId
					modified
					altText
					caption
					mediaItemUrl
					imageFile {
						childImageSharp {
							fluid(maxWidth: 650) {
								base64
								aspectRatio
								src
								srcSet
								sizes
							}
						}
					}
				}
				author {
					name
					slug
					email
					avatar {
						url
						width
						height
					}
				}
				tags {
					nodes {
						name
						link
					}
				}
				categories {
					nodes {
						name
						link
					}
				}
				blocks {
					...HeadingBlockInfo
					...ListBlockInfo
					...ParagraphBlockInfo
					...ImageBlockInfo
					...CodeBlockInfo
					...YouTubeBlockInfo
					...HTMLBlockInfo
					...SeparatorBlockInfo
					...SpacerBlockInfo
					...QuoteBlockInfo
					...ShortCodesBlockInfo
					...ACFHomeBlock
				}
				seo {
					title
					metaDesc
					focuskw
				}
			}
		}
	}
`;
