import React from "react"
import { graphql } from 'gatsby'
//import Img from "gatsby-image"

import { randomID } from "../utils/helpers"

import Heading from "../blocks/core/Header"
import Paragraph from "../blocks/core/Paragraph"


import Layout from "../components/body/layout"

const Page = props => {
const {
  data: {
    wordpress: { page },
  },
} = props
const { title, blocks } = page
//console.log(blocks)
  return (
    <Layout>
     
      {/* <h1>All Props</h1> */}
      {/* <pre>{JSON.stringify(props, null, 4)}</pre> */}

      {/* <h1>Pulling Data Out</h1>
      <pre>{JSON.stringify(title, null, 4)}</pre>
      <pre>{JSON.stringify(content, null, 4)}</pre> */}

      <h1 dangerouslySetInnerHTML={{__html: title}} />
      
      {blocks.map(block => (
        <div key={`component-${randomID()}`}>
          {block.name === "core/heading" ? <Heading {...block} {...block.data} {...block.attributes} /> : null}
          {block.name === "core/paragraph" ? <Paragraph {...block} {...block.data} {...block.attributes} /> : null}
        </div>
      ))}
      
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
        blocks {
          ... on WORDPRESS_CoreHeadingBlock {
            attributes {
              align
              anchor
              className
              placeholder
              level
              content
            }
            name
            originalContent
            isValid
            parentId
          }
          ... on WORDPRESS_CoreParagraphBlock {
            parentId
            name
            originalContent
            isValid
            attributes {
              ... on WORDPRESS_CoreParagraphBlockAttributesV3 {
                content
                className
              }
            }
          }
          parentId
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