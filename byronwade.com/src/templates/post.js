import React from "react"
import moment from "moment/moment"
import { graphql } from 'gatsby'
import Img from "gatsby-image"

import Layout from "../components/body/layout"

const Post = props => {
const {
  data: {
    wordpress: { post },
  },
} = props
const { title, content, date, author, featuredImage } = post
  console.log(post.blocks)
  return (
    <Layout>
      
      {featuredImage ? (<Img fluid={featuredImage.imageFile.childImageSharp.fluid} alt="Gatsby Docs are awesome" />) : null}
      <h1 dangerouslySetInnerHTML={{__html: title}} />
      
      <small>{moment(date).format(`MMM Do YYYY`)}</small><small>{author.name}</small>
      <div dangerouslySetInnerHTML={{__html: content}} />

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
        featuredImage {
          sourceUrl
          mediaItemId
          modified
          imageFile {
            childImageSharp {
              fluid(maxWidth: 650) {
                base64
                aspectRatio
                src
                srcSet
                sizes
              }
            }
          }
        }
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
          parentId
          name
          originalContent
        }
        blocksJSON
      }
    }
  }
`