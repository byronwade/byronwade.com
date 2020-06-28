//Import for code parts of react and gatsby
import React from "react"; //reacts core
import { graphql } from 'gatsby'
import ReactHtmlParser from "react-html-parser"; //parse html
import moment from "moment/moment"; //date formatting
import Img from "gatsby-image"; //gatsby image API
import { Helmet } from "react-helmet"
import Pagination from "../parts/pagnation"

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links
import SEO from "../utils/seo" //adding SEO

//Link import to check if internal or external link
import Link from "../utils/links"; //custom links

//Import Blocks
//import BlockList from "../blocks/BlockList"

//Import Fragment queries
//import HeadingBlockInfo from "../blocks/blockFragments/core/Header"
//import ListBlockInfo from "../blocks/blockFragments/core/List"

//Import Layout for pages
import Layout from "../body/layout";

const Works = (props) => {

	const { data, location, pageContext: { pageNumber, hasNextPage, pageInfo } } = props
	const { seo } = pageInfo.wordpress.page

	const WebPage = {
		"@context": "https://schema.org/",
		"@type": "WebSite",
		"name": seo.title
	};

	return (
	<>
		<Helmet><script type="application/ld+json">{JSON.stringify(WebPage)}</script></Helmet>
		<SEO title={seo.title} description={seo.metaDesc} robots="index, follow" />
		<Layout pageNumber={pageNumber} location={{ location }}>
			<div className="grid">
				{data?.wordpress?.works.nodes.map((work) => (
						<div className="gridItem" key={work.id}>
							{work?.featuredImage ? (
								<Img fluid={work.featuredImage.imageFile.childImageSharp.fluid} alt='Gatsby Docs are awesome' />
							) : null}
							<h1>{ReactHtmlParser(work.title)}</h1>
							<small>{moment(work.date).format(`MMM Do YYYY`)}</small>
							<div>{ReactHtmlParser(work.excerpt)}</div>
							<Link to={props.path + work.slug}>Read More</Link>
						</div>
					))}
			</div>

			<Pagination pageNumber={pageNumber} hasNextPage={hasNextPage} location={location}/>

		</Layout>
	</>
	);
}

export default Works;

export const query = graphql`
  query GET_WORKS($id: Int) {
    wordpress {
      works(first:13, where: { id: $id }) {
        nodes {
          id
          slug
          date
          title
          excerpt
          uri
          featuredImage {
            sourceUrl
            mediaItemId
            modified
            altText
            caption
            mediaItemUrl
            imageFile {
              childImageSharp {
                fluid(maxWidth: 650, maxHeight: 400, quality: 70) {
                  base64
                  aspectRatio
                  src
                  srcSet
                  sizes
                }
              }
            }
          }
        }
      }
    }
  }
`