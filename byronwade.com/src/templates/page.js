import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const Page = props => {
const {
  data: {
    wordpress: { page },
  },
} = props
const { title, content } = page

  return (
    <Layout>
      <h1>All Props</h1>
      <pre>{JSON.stringify(props, null, 4)}</pre>

      <h1>Pulling Data Out</h1>
      <pre>{JSON.stringify(title, null, 4)}</pre>
      <pre>{JSON.stringify(content, null, 4)}</pre>
    </Layout>
  )
 }

export default Page

export const pageQuery = graphql`
  query GET_PAGE($id: ID!) {
    wordpress {
      page(id: $id) {
        isFrontPage
        slug
        title
        uri
        content
        featuredImage {
          sourceUrl
          title
          slug
        }
        blocks {
          name
        }
        author {
          name
          slug
          email
        }
      }
    }
  }
`