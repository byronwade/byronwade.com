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
      previousLink = `/case-study/`
    } else if (1 < pageNumber) {
      previousLink = `/case-study/${pageNumber - 1}`
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
        <Link type="primary" to={`/case-study/${pageNumber + 1}`} >
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
        {data && data.wordpress && data.wordpress.casestudys.nodes.map(casestudy => (
            <div key={casestudy.id}>
              <pre>{JSON.stringify(casestudy.featuredImage, null, 4)}</pre>
              <h1>{casestudy.title}</h1>
              <small>{casestudy.date}</small>
              <div dangerouslySetInnerHTML={{__html: casestudy.excerpt}} />
              {/* <p>{casestudy.excerpt}</p> */}
              <Link to={"/"+casestudy.uri}>Read More</Link>
            </div>
          ))}


          {this.pagination()}

          
      </Layout>
    )
  }
}

export default IndexPage

export const query = graphql`
  query GET_CASES($id: Int) {
    wordpress {
      casestudys(where: { id: $id }) {
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
        }
      }
    }
  }
`