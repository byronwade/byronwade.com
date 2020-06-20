//Import for code parts of react and gatsby
import React, { Component } from 'react' //reacts core
import { globalHistory as history } from '@reach/router'
import { graphql } from 'gatsby'
import ReactHtmlParser from 'react-html-parser'; //parse html
import moment from "moment/moment" //date formatting
import Img from "gatsby-image" //gatsby image API
import { Helmet } from "react-helmet"

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links
import SEO from "../utils/seo" //adding SEO

//Link import to check if internal or external link
import Link from "../utils/links" //custom links

//Import Blocks
//import BlockList from "../blocks/BlockList"

//Import Fragment queries
//import HeadingBlockInfo from "../blocks/blockFragments/core/Header"
//import ListBlockInfo from "../blocks/blockFragments/core/List"

//Import Layout for pages
import Layout from "../body/layout"

class IndexPage extends Component {

  renderPreviousLink = () => {
    const { location } = history //get current location for page
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
      //console.log(previousLink)
    }

    return (
      <Link type="primary" to={previousLink}>
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
      //console.log(newPath)
      return (
        <Link type="primary" to={newPath} >
          Next Posts
        </Link>
      )
    } else {
      return null
    }
  }

  pagination = () => {
    const { pageContext: { hasNextPage }, } = this.props
    //console.log(this.renderNextLink())
    if (hasNextPage) {
      return (
        <div className="pagnation">
          <span className="next">{this.renderNextLink()}</span>
          <span className="previous">{this.renderPreviousLink()}</span>
        </div>
      )
    } else {
      return null
    }
  }

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
            <div className="gridItem contentHeader">
              <h1>Valuable Info</h1>
              <p>Website, domains and hosting info stuff everyone wants to know.</p>
            </div>
            {data && data.wordpress && data.wordpress.posts.nodes.map(post => {
                return (
                <Link className="gridItem" key={post.id} to={"/blog/"+post.slug}>
                  <div className="blogPostContainer">
                    {post.featuredImage ? (
                      <div className="overlayWrapper">
                        <Img className="blogPhoto" fluid={post.featuredImage.imageFile.childImageSharp.fluid} alt="Gatsby Docs are awesome" />
                        <div className="overlay"></div>
                      </div>
                    ) : (
                      <div className="overlayWrapper">
                        <div className="rect"></div>
                        <div className="overlay"></div>
                      </div>
                    )}
                    <h1 className="blogTitle">{ReactHtmlParser(post.title)}</h1>
                    <span className="blogDate">{moment(post.date).format(`MMM Do YYYY`)}</span>
                    <div className="blogLink" to={"/blog/"+post.slug}>Read More</div>
                  </div>
                </Link>
                )
              })}

            </div>
            
            {this.pagination()}

        </Layout>
      </>
    )
  }
}
// set GATSBY_CONCURRENT_DOWNLOAD=1 && 
export default IndexPage


export const query = graphql`
  query GET_POSTS($id: [ID]) {
    wordpress {
      posts(first:13, where: { in: $id }) {
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
          blocks {
            name
          }
        }
      }
    }
  }
`