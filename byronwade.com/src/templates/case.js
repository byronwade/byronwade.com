import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const Case = props => {
  const {
    data: {
      wordpress: { post },
    },
    pageContext,
  } = props
  const { title, content } = post

  return (
    <Layout>
        <pre>{JSON.stringify(pageContext, null, 4)}</pre>
        <pre>{JSON.stringify(post, null, 4)}</pre>
    </Layout>
  )
}

export default Case

export const pageQuery = graphql`
  query GET_CASE($id: ID!) {
    wordpress {
      case(id: $id) {
        title
        content
        uri
        author {
          name
          slug
          avatar {
            url
          }
        }
      }
    }
  }
`