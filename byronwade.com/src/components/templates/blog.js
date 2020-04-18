//Import for code parts of react and gatsby
import React, { Component } from 'react' //reacts core
import { graphql } from 'gatsby' //gatsbys graphql setup
import ReactHtmlParser from 'react-html-parser'; //parse html
import moment from "moment/moment" //date formatting
import Img from "gatsby-image" //gatsby image API

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
    const { pageContext: { pageNumber }, } = this.props

    let previousLink = null

    if (!pageNumber) {
      return null
    } else if (1 === pageNumber) {
      previousLink = `/blog/`
    } else if (1 < pageNumber) {
      previousLink = `/blog/${pageNumber - 1}`
    }

    return (
      <Link type="primary" to={previousLink}>
        Previous Posts
      </Link>
    )
  }

  renderNextLink = () => {
    const { pageContext: { hasNextPage, pageNumber }, } = this.props

    if (hasNextPage) {
      return (
        <Link type="primary" to={`/blog/${pageNumber + 1}`} >
          Next Posts
        </Link>
      )
    } else {
      return null
    }
  }

  pagination = () => {
    const { pageContext: { hasNextPage }, } = this.props

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
    // open the browser the root page shows up, navigate to the blog page and it shows the error cannot find title or 
    const { data, location, pageContext: { pageNumber }, } = this.props
    console.log(data)

    return (
      <Layout pageNumber={pageNumber} location={{ location }}>
        {data && data.wordpress && data.wordpress.posts.nodes.map(post => {
          console.log(post.featuredImage)
            return <div key={post.id}>
              {post.featuredImage ? (<Img fluid={post.featuredImage.imageFile.childImageSharp.fluid} alt="Gatsby Docs are awesome" />) : null}
              <h1>{ReactHtmlParser(post.title)}</h1>
              <small>{moment(post.date).format(`MMM Do YYYY`)}</small>
              <div>{ReactHtmlParser(post.excerpt)}</div>
              <Link to={"/blog/"+post.uri}>Read More</Link>
            </div>
          })}
          {this.pagination()}
      </Layout>
    )
  }
}
// set GATSBY_CONCURRENT_DOWNLOAD=1 && 
export default IndexPage


export const query = graphql`
  query GET_POSTS($ids: [ID]) {
    wordpress {
      posts(where: { in: $ids }) {
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
          blocks {
            name
          }
        }
      }
    }
  }
`