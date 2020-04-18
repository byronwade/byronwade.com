//Import for code parts of react and gatsby
import React from "react" //reacts core
import { graphql } from 'gatsby' //gatsbys graphql setup
import ReactHtmlParser from 'react-html-parser'; //parse html
//import Img from "gatsby-image" //gatsby image API

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links

//Import Blocks
import BlockList from "../blocks/BlockList"

//Import Fragment queries
import HeadingBlockInfo from "../blocks/blockFragments/core/Header"
import ListBlockInfo from "../blocks/blockFragments/core/List"

//Import Layout for pages
import Layout from "../body/layout"


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
      <h1>{ReactHtmlParser(title)}</h1>
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