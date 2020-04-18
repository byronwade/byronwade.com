import React from "react"
import { graphql } from 'gatsby'
//import Img from "gatsby-image"



//Import Blocks
import BlockList from "../blocks/BlockList"

//Import Fragment queries
import HeadingBlockInfo from "../node/blocks/core/Header"
import ListBlockInfo from "../node/blocks/core/List"



import Layout from "../components/body/layout"


const Page = props => {
const {
  data: {
    wordpress: { page },
  },
} = props
const { title, blocks } = page

console.log(blocks)

  return (
    <Layout>

      <h1 dangerouslySetInnerHTML={{__html: title}} />

      <BlockList blocks={blocks} />
      
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
          ...HeadingBlockInfo
          ...ListBlockInfo
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