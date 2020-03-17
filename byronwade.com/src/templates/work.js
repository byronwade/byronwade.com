import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const Work = props => {
const {
  data: {
    wordpress: { work },
  },
} = props
const { title, blocks } = work

  return (
    <Layout>
      <h1>All Props</h1>
      <pre>{JSON.stringify(props, null, 4)}</pre>

      <h1>Pulling Data Out</h1>
      <pre>{JSON.stringify(title, null, 4)}</pre>
      <pre>{JSON.stringify(blocks, null, 4)}</pre>
    </Layout>
  )
 }

export default Work

export const pageQuery = graphql`
  query GET_WORK($id: ID!) {
    wordpress {
      work(id: $id) {
        title
        content
        uri
        date
        author {
          name
          uri
          email
          avatar {
            url
          }
        }
        blocks {
          name
        }
      }
    }
  }
`