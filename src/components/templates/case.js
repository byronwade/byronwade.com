//Import for code parts of react and gatsby
import React from "react"; //reacts core
import { graphql } from "gatsby"; //gatsbys graphql setup
import ReactHtmlParser from "react-html-parser"; //parse html
import Img from "gatsby-image"; //gatsby image API

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links
import SEO from "../utils/seo"; //adding SEO

//Import Blocks
import BlockList from "../blocks/BlockList";

//Import Layout for pages
import Layout from "../body/layout";

const Case = (props) => {
	const {
		data: {
			wordpress: { casestudy },
		},
	} = props;
	const {
		title,
		content,
		//date,
		//author,
		featuredImage,
		seo,
		link,
		blocks,
	} = casestudy;

	return (
		<Layout>
			<SEO title={seo.title} description={seo.metaDesc} /*image={featuredImage.link ? featuredImage.link : null}*/ url={link ? link : null} />

			{featuredImage && featuredImage.imageFile ? (
				<Img fluid={featuredImage.imageFile.childImageSharp.fluid} alt='Gatsby Docs are awesome' />
			) : null}
			<h1>{ReactHtmlParser(title)}</h1>

			<BlockList blocks={blocks} content={content} />
		</Layout>
	);
};

export default Case;

export const pageQuery = graphql`
	query GET_CASE($id: ID!) {
		wordpress {
			casestudy(id: $id) {
				title
				content
				uri
				date
				featuredImage {
					sourceUrl
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
					uri
					email
					avatar {
						url
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
