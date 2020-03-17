import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const Case = props => {
  const {
    data: {
      wordpress: { casestudy },
    },
  } = props
  const { title, content } = casestudy

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

export default Case

export const pageQuery = graphql`
  query GET_CASE($id: ID!) {
    wordpress {
      casestudy(id: $id) {
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