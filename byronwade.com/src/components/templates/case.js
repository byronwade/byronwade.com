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

const Case = props => {
  const {
    data: {
      wordpress: { casestudy },
    },
  } = props
  const { title, content } = casestudy

  return (
    <Layout>
      <h1>{ReactHtmlParser(title)}</h1>
      <div>{ReactHtmlParser(content)}</div>
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