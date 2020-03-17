import React, { Component } from "react"
import { graphql } from "gatsby"
import Link from "../utils/links"

import Layout from "../components/body/layout"

class WorksPage extends Component {
  renderPreviousLink = () => {
    const { pageContext: { pageNumber }, } = this.props

    let previousLink = null

    if (!pageNumber) {
      return null
    } else if (1 === pageNumber) {
      previousLink = `/work/`
    } else if (1 < pageNumber) {
      previousLink = `/work/${pageNumber - 1}`
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
        <Link type="primary" to={`/work/${pageNumber + 1}`} >
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
        {data && data.wordpress && data.wordpress.works.nodes.map(work => (
            <div key={work.id}>
              <pre>{JSON.stringify(work.featuredImage, null, 4)}</pre>
              <h1>{work.title}</h1>
              <small>{work.date}</small>
              <p>{work.excerpt}</p>
              <Link to={'/'+work.uri}>Read More</Link>
            </div>
          ))}


          {this.pagination()}


      </Layout>
    )
  }
}

export default WorksPage

export const query = graphql`
  query GET_WORKS($id: Int) {
    wordpress {
      works(where: { id: $id }) {
        nodes {
          id
          slug
          date
          title
          excerpt
          uri
          featuredImage {
            altText
            caption
            mediaItemUrl
          }
        }
      }
    }
  }
`