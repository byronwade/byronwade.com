//Import for code parts of react and gatsby
import React from "react"; //reacts core
import { graphql } from "gatsby"; //gatsbys graphql setup
import ReactHtmlParser from "react-html-parser"; //parse html
import moment from "moment/moment"; //date formatting
import Img from "gatsby-image"; //gatsby image API
import { Helmet } from "react-helmet"
import _ from 'lodash'
import styled, { createGlobalStyle } from "styled-components"

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links
import SEO from "../utils/seo"; //adding SEO

//Link import to check if internal or external link
import Link from "../utils/links" //custom links

//Import Blocks
import BlockList from "../blocks/BlockList";

//Import Layout for pages
import Layout from "../body/layout";

const Post = (props) => {

	const GlobalStyles = createGlobalStyle`
		body {
			color: ${props => props.theme.light.colors.text};
			background: ${props => props.theme.light.colors.background};
		}
	`

	const {
		data: {
			wordpress: { post, allSettings },
		},
	} = props;
	const {
		title,
		content,
		date,
		//excerpt,
		modified,
		author,
		readingTime,
		featuredImage,
		seo,
		link,
		blocks,
		tags,
		categories,
	} = post;
	const { generalSettingsTitle } = allSettings

	console.log(tags)

    const Article = {
		"@context": "https://schema.org/",
		"@type": "Article",
		"mainEntityOfPage": {
		  "@type": "WebPage",
		  "@id": link ? link : null
		},
		"headline": title,
		"image": {
		  "@type": "ImageObject",
		  "url": featuredImage?.imageFile ? featuredImage.sourceUrl : null,
		  "width": `${featuredImage?.imageFile ? featuredImage.mediaDetails.width : null}px`,
		  "height": `${featuredImage?.imageFile ? featuredImage.mediaDetails.height : null}px`
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
			"url": author?.avatar ? author.avatar.url : null,
			"width": `${author?.avatar ? author.avatar.width : null}px`,
			"height": `${author?.avatar ? author.avatar.height : null}px`
		  }
		},
		"datePublished": moment(date).format(`YYYY-MM-Do`),
		"dateModified": moment(modified).format(`YYYY-MM-Do`)
	}

	// const FAQPage = {
	// 	"@type": "FAQPage",
	// 	"mainEntity": {
	// 	  "@type": "Question",
	// 	  "name": "",
	// 	  "acceptedAnswer": {
	// 		"@type": "Answer",
	// 		"text": ""
	// 	  }
	// 	}
	// }

	// const HowTo = {
	// 	"@type": "HowTo",
	// 	"name": "",
	// 	"supply": {
	// 	  "@type": "HowToSupply",
	// 	  "name": ""
	// 	},
	// 	"tool": {
	// 	  "@type": "HowToTool",
	// 	  "name": ""
	// 	},
	// 	"step": [{
	// 	  "@type": "HowToStep",
	// 	  "text": ""
	// 	},{
	// 	  "@type": "HowToStep",
	// 	  "text": ""
	// 	},{
	// 	  "@type": "HowToStep",
	// 	  "text": ""
	// 	}]
	// }

	const All = {
		"@context": "http://schema.org",
		"@graph": [
			Article,
			//FAQPage,
			//HowTo
		]
	}
	return (
		<Layout>
			<GlobalStyles />
        	<Helmet>
				<script type="application/ld+json">
          			{JSON.stringify(All)}
				</script>
			</Helmet>
			<SEO title={seo.title} description={_.truncate(seo.metaDesc, {'length': 290 ,'separator': ' '})} /*image={featuredImage.link ? featuredImage.link : null}*/ url={link ? link : null} robots='index, follow' />

			{featuredImage?.imageFile ? (
				<div className="featuredImage"><Img fluid={featuredImage.imageFile.childImageSharp.fluid} alt='Gatsby Docs are awesome' /></div>
			) : null}

			<h1>{ReactHtmlParser(title)}</h1>

			<Link to={`/blog${author.uri}`}>
				<img src={author.avatar.url} alt={`Author - ${author.name}`} />
				<div><small>{moment(date).format(`MMM Do YYYY`)}</small></div>
				<div><small>{author.name}</small></div>
			</Link>


			<div><small>Reading Time: {readingTime}</small></div>

			{tags ? tags.nodes.map(tag => {
				return <Link key={tag.name} to={`/blog${tag.uri}`}>{tag.name}</Link>
			}): null}

			{categories ? categories.nodes.map(category => {
				return <Link key={category.name} to={`/blog${category.uri}`}>{category.name}</Link>
			}): null}

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
				modified
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
					uri
					avatar {
						url
						width
						height
					}
				}
				tags {
					nodes {
						name
						uri
					}
				}
				categories {
					nodes {
						name
						uri
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
