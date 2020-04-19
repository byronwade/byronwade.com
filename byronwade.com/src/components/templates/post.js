//Import for code parts of react and gatsby
import React from "react" //reacts core
import { graphql } from 'gatsby' //gatsbys graphql setup
import ReactHtmlParser from 'react-html-parser'; //parse html
import moment from "moment/moment" //date formatting
import Img from "gatsby-image" //gatsby image API

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links
import SEO from "../utils/seo" //adding SEO

//Import Blocks
//import BlockList from "../blocks/BlockList"

//Import Fragment queries
import HeadingBlockInfo from "../blocks/blockFragments/core/Header"
import ListBlockInfo from "../blocks/blockFragments/core/List"

//Import Layout for pages
import Layout from "../body/layout"

const Post = props => {
const {
  data: {
    wordpress: { post },
  },
} = props
const { title, content, date, author, featuredImage, seo, link } = post
  console.log(featuredImage)
  return (
    <Layout>
      <SEO title={seo.title} description={seo.metaDesc} image={featuredImage.link} url={link} robots="index, follow" />
      {featuredImage.imageFile ? (<Img fluid={featuredImage.imageFile.childImageSharp.fluid} alt="Gatsby Docs are awesome" />) : null}
      <h1>{ReactHtmlParser(title)}</h1>
      <small>{moment(date).format(`MMM Do YYYY`)}</small><small>{author.name}</small>
      <div>{ReactHtmlParser(content)}</div>
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
        link
        date
        featuredImage {
          link
          imageFile {
            publicURL
            relativePath
            relativeDirectory
            url
            sourceInstanceName
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
          ...HeadingBlockInfo
          ...ListBlockInfo
        }
        seo {
          title
          metaDesc
          focuskw
        }
      }
    }
  }
`