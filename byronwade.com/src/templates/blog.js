import React, { Component } from "react"
import { graphql } from "gatsby"
import Link from "../utils/links"

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

  render() {
    const { data, location, pageContext: { pageNumber }, } = this.props
    const blogPageNumber = pageNumber ? ` Page ${pageNumber}` : ``
    return (
      <Layout pageNumber={pageNumber} location={{ location }}>
        {data && data.wordpress && data.wordpress.posts.nodes.map(post => (
            <div key={post.id}>
              {blogPageNumber}
            </div>
          ))}
        <div>
          {this.renderPreviousLink()}
        </div>
        <div>
          {this.renderNextLink()}
        </div>
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
        }
      }
    }
  }
`