import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"

const User = props => {
const {
  data: {
    wordpress: { user },
  },
} = props
const { uri, name } = user

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

export default User

export const pageQuery = graphql`
  query GET_USER($id: ID!) {
    wordpress {
      user(id: $id) {
        uri
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