import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"
import Link from "../utils/links"

const Tag = props => {
const {
  data: {
    wordpress: { tag },
  },
} = props
const { slug, name, posts } = tag

  return (
    <Layout>
        {/* <h1>All Props</h1>
        <pre>{JSON.stringify(props, null, 4)}</pre>

        <h1>Pulling Data Out</h1>
        <pre>{JSON.stringify(slug, null, 4)}</pre>
        <pre>{JSON.stringify(name, null, 4)}</pre> */}
        <h1>Tags: {name}</h1>

        {
          posts.nodes.map(post => (
              <div key={post.id}>
                {/* <pre>{JSON.stringify(post.featuredImage, null, 4)}</pre> */}
                <h1>{post.title}</h1>
                <small>{post.date}</small>
                <div dangerouslySetInnerHTML={{__html: post.excerpt}} />
                <Link to={"/blog/"+post.uri}>Read More</Link>
              </div>
          ))
        }
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
            id
            title
            date
            excerpt
            slug
            title
            uri
          }
        }
      }
    }
  }
`