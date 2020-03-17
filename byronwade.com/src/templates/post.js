import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const Post = props => {
const {
  data: {
    wordpress: { post },
  },
} = props
const { title, content } = post

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

export default Post

export const pageQuery = graphql`
  query GET_POST($id: ID!) {
    wordpress {
      post(id: $id) {
        title
        content
        uri
        date
        author {
          name
          slug
          email
          avatar {
            url
          }
        }
        tags {
          nodes {
            name
            link
          }
        }
        categories {
          nodes {
            name
            link
          }
        }
        blocks {
          name
        }
      }
    }
  }
`