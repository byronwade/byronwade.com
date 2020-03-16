import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const Tag = props => {
const {
  data: {
    wordpress: { tag },
  },
  pageContext,
} = props
const { title, content } = tag

  return (
    <Layout>
        <pre>{JSON.stringify(pageContext, null, 4)}</pre>
        <pre>{JSON.stringify(tag, null, 4)}</pre>
    </Layout>
  )
 }

export default Tag

export const pageQuery = graphql`
  query GET_TAG($id: ID!) {
    wordpress {
      tag(id: $id) {
        uri
        slug
        name
        posts {
          nodes {
            slug
            title
            uri
          }
        }
      }
    }
  }
`