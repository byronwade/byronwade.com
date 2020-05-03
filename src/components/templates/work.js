//Import for code parts of react and gatsby
import React from "react" //reacts core
import { graphql } from 'gatsby' //gatsbys graphql setup
import ReactHtmlParser from 'react-html-parser'; //parse html
//import moment from "moment/moment" //date formatting
//import Img from "gatsby-image" //gatsby image API

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links

//Import Blocks
//import BlockList from "../blocks/BlockList"

//Import Fragment queries
//import HeadingBlockInfo from "../blocks/blockFragments/core/Header"
//import ListBlockInfo from "../blocks/blockFragments/core/List"

//Import Layout for pages
import Layout from "../body/layout"

const Work = props => {
const {
  data: {
    wordpress: { work },
  },
} = props
const { title, blocks, content } = work

  return (
    <Layout>
      <h1>{ReactHtmlParser(title)}</h1>
      <div>{ReactHtmlParser(content)}</div>
      <div>{ReactHtmlParser(blocks)}</div>
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