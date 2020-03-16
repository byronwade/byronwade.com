import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const Post = props => {
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

export default Post

export const pageQuery = graphql`
  query GET_POST($id: ID!) {
    wordpress {
      post(id: $id) {
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
      }
    }
  }
`