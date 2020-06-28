//Import for code parts of react and gatsby
import React from "react"; //reacts core
import { graphql } from "gatsby"; //gatsbys graphql setup
import ReactHtmlParser from "react-html-parser"; //parse html
import moment from "moment/moment"; //date formatting
import Img from "gatsby-image"; //gatsby image API
import { Helmet } from "react-helmet"
import styled, { createGlobalStyle } from "styled-components"

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links
import SEO from "../utils/seo"; //adding SEO

//Import Blocks
import BlockList from "../blocks/BlockList";

//Import Layout for pages
import Layout from "../body/layout";

const Work = (props) => {

	const GlobalStyles = createGlobalStyle`
		body {
			color: ${props => props.theme.light.colors.text};
			background: ${props => props.theme.light.colors.background};
		}
	`

	const {
		data: {
			wordpress: { work, allSettings },
		},
	} = props;
	const {
		title,
		content,
		date,
		//excerpt,
		modified,
		author,
		//readingTime,
		featuredImage,
		seo,
		link,
		blocks,
	} = work;
	const { generalSettingsTitle } = allSettings





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
			<SEO title={seo.title} description={seo.metaDesc} /*image={featuredImage.link ? featuredImage.link : null}*/ url={link ? link : null} />

			{featuredImage?.imageFile ? (
				<Img fluid={featuredImage.imageFile.childImageSharp.fluid} alt='Gatsby Docs are awesome' />
			) : null}
			<h1>{ReactHtmlParser(title)}</h1>

			<BlockList blocks={blocks} content={content} />
		</Layout>
	);
};

export default Work;

export const pageQuery = graphql`
	query GET_WORK($id: ID!) {
		wordpress {
			allSettings {
			  generalSettingsTitle
			}
			work(id: $id) {
				title
				content
				uri
				link
				excerpt
				modified
				date
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
