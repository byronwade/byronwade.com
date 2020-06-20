//Import for code parts of react and gatsby
import React, { Component } from "react"; //reacts core
import { graphql } from 'gatsby'
import ReactHtmlParser from "react-html-parser"; //parse html
import moment from "moment/moment"; //date formatting
import Img from "gatsby-image"; //gatsby image API
import { Helmet } from "react-helmet"

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

class CasesPage extends Component {

	renderPreviousLink = () => {
	  const { pageContext: { pageNumber }, } = this.props
  
	  let previousLink = null
  
	  if (!pageNumber) {
		return null
	  } else if (1 === pageNumber) {
		previousLink = this.props.path
	  } else if (1 < pageNumber) {
		let path = this.props.path.split("/")
		path[2] = Number(path[2]) - 1
		previousLink = path.join('/')
		console.log(previousLink)
	  }
  
	  return (
		<Link type="primary" to={'/'+previousLink}>
		  Previous Posts
		</Link>
	  )
	}
  
	renderNextLink = () => {
	  const { pageContext: { hasNextPage }, } = this.props
	  if (hasNextPage) {
		let path = this.props.path.split("/")
		path[2] = Number(path[2]) + 1
		const newPath = path.join('/')
		console.log(newPath)
		return (
		  <Link type="primary" to={'/'+newPath} >
			Next Posts
		  </Link>
		)
	  } else {
		return null
	  }
	}

	pagination = () => {
		const {
			pageContext: { hasNextPage },
		} = this.props;

		if (hasNextPage) {
			return (
				<div className='pagnation'>
					<span className='next'>{this.renderNextLink()}</span>
					<span className='previous'>{this.renderPreviousLink()}</span>
				</div>
			);
		} else {
			return null;
		}
	};

	render() {
		const { data, location, pageContext: { pageNumber, pageInfo } } = this.props
		const { seo } = pageInfo.wordpress.page

		console.log(this.props)
	
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
					{data &&
						data.wordpress &&
						data.wordpress.casestudys.nodes.map((casestudy) => (
							<div className="gridItem" key={casestudy.id}>
								{casestudy.featuredImage ? (
									<Img fluid={casestudy.featuredImage.imageFile.childImageSharp.fluid} alt='Gatsby Docs are awesome' />
								) : null}
								<h1>{ReactHtmlParser(casestudy.title)}</h1>
								<small>{moment(casestudy.date).format(`MMM Do YYYY`)}</small>
								<div>{ReactHtmlParser(casestudy.excerpt)}</div>
								<Link to={this.props.path + casestudy.slug}>Read More</Link>
							</div>
						))}
				</div>
				{this.pagination()}
			</Layout>
		</>
		);
	}
}

export default CasesPage;


export const query = graphql`
  query GET_CASES($id: Int) {
    wordpress {
      casestudys(first:13, where: { id: $id }) {
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
