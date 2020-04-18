//Import for code parts of react and gatsby
import React from "react" //reacts core
import { graphql } from 'gatsby' //gatsbys graphql setup
import ReactHtmlParser from 'react-html-parser'; //parse html
import moment from "moment/moment" //date formatting
//import Img from "gatsby-image" //gatsby image API

//Link import to check if internal or external link
import Link from "../utils/links" //custom links

//Import Blocks
//import BlockList from "../blocks/BlockList"

//Import Fragment queries
//import HeadingBlockInfo from "../blocks/blockFragments/core/Header"
//import ListBlockInfo from "../blocks/blockFragments/core/List"

//Import Layout for pages
import Layout from "../body/layout"

const Tag = props => {
const {
  data: {
    wordpress: { tag },
  },
} = props
const { name, posts } = tag

  return (
    <Layout>
      <h1>Tags: {name}</h1>
      {posts.nodes.map(post => (
            <div key={post.id}>
              <h1>{ReactHtmlParser(post.title)}</h1>
              <small>{moment(post.date).format(`MMM Do YYYY`)}</small>
              <div>{ReactHtmlParser(post.excerpt)}</div>
              <Link to={"/blog/"+post.uri}>Read More</Link>
            </div>
        ))}
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