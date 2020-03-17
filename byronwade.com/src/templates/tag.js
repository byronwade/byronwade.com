import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const Tag = props => {
const {
  data: {
    wordpress: { tag },
  },
} = props
const { slug, name } = tag

  return (
    <Layout>
        <h1>All Props</h1>
        <pre>{JSON.stringify(props, null, 4)}</pre>

        <h1>Pulling Data Out</h1>
        <pre>{JSON.stringify(slug, null, 4)}</pre>
        <pre>{JSON.stringify(name, null, 4)}</pre>
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