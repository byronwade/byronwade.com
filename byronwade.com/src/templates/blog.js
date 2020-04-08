import React, { Component } from "react"
import { graphql } from "gatsby"
import Link from "../utils/links"
//import Img from "gatsby-image"

import Layout from "../components/body/layout"

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
    const { data, location, pageContext: { pageNumber }, } = this.props
    return (
      <Layout pageNumber={pageNumber} location={{ location }}>
        {data && data.wordpress && data.wordpress.posts.nodes.map(post => (
            <div key={post.id}>
              {/* <pre>{JSON.stringify(post.featuredImage, null, 4)}</pre> */}
              <h1>{post.title}</h1>
              <small>{post.date}</small>
              <div dangerouslySetInnerHTML={{__html: post.excerpt}} />
              <Link to={"/blog/"+post.uri}>Read More</Link>
            </div>
          ))}


          {this.pagination()}


      </Layout>
    )
  }
}

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