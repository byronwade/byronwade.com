import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const Category = props => {
const {
  data: {
    wordpress: { category },
  },
} = props
const { uri, name } = category

  return (
    <Layout>
        <h1>All Props</h1>
        <pre>{JSON.stringify(props, null, 4)}</pre>

        <h1>Pulling Data Out</h1>
        <pre>{JSON.stringify(uri, null, 4)}</pre>
        <pre>{JSON.stringify(name, null, 4)}</pre>
    </Layout>
  )
 }

export default Category

export const pageQuery = graphql`
  query GET_CATEGORY($id: ID!) {
    wordpress {
      category(id: $id) {
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