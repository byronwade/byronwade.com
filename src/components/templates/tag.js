//Import for code parts of react and gatsby
import React from "react" //reacts core
import { graphql } from 'gatsby' //gatsbys graphql setup
import ReactHtmlParser from 'react-html-parser'; //parse html
import moment from "moment/moment"; //date formatting
import Img from "gatsby-image"; //gatsby image API
import { Helmet } from "react-helmet"
import _ from 'lodash'
import styled from "styled-components"

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links
import SEO from "../utils/seo"; //adding SEO

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
const { name, posts, seo, link } = tag

const WebPage = {
  "@context": "https://schema.org/",
  "@type": "WebSite",
  "name": seo.title
};

const Blog = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  .rect {
    width: 100%;
    height:400px;
    background-color: #868e96;
    position: relative;
  }
  .overlayWrapper{
    position: relative;
    transition: 0.2s ease-in-out;
    transform: scale(1);
    &:hover {
      transform: scale(1.2);
    }
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-image: linear-gradient(to top, #141618 0%, rgba(20, 22, 24, 0) 50%) !important;
  }
  .blogPhoto{
    width: 100%;
    height:400px;
  }
  .blogContent {
    position: absolute;
    bottom: 0px;
    padding: 30px 20px 0;
    color: #fff;
    z-index: 11;
  }
  .blogTitle {
    padding-bottom:1em;
    font-size:2em;
  }
  .blogP{
    line-height: 25px;
    padding-top:10px;
  }
  .blogDate{
    color: #fff;
    padding: 10px;
    font-weight: bold;
    z-index: 11;
  }
  .blogLink {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 5px 23px;
    background: #fff;
    margin: 10px;
    border-radius: 5px;
    color: #111;
    z-index: 11;
    &:hover {
      background: #7851A9;
      color: #fff;
    }
  }
`;

  return (
    <Layout>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(WebPage)}
        </script>
      </Helmet>
      <SEO title={seo.title} description={_.truncate(seo.metaDesc, {'length': 290 ,'separator': ' '})} /*image={featuredImage.link ? featuredImage.link : null}*/ url={link ? link : null} robots='index, follow' />

      <div className="contentHeader">
        <h1>Tags: {name}</h1>
        <p>Website, domains and hosting info stuff everyone wants to know.</p>
      </div>

      <div className="grid">
        {posts.nodes.map(post => (
            <Link className="gridItem" key={post.id} to={"/blog/"+post.slug}>
              <Blog>

                {post.featuredImage ? (
                  <div className="overlayWrapper">
                    <Img className="blogPhoto" fluid={post.featuredImage.imageFile.childImageSharp.fluid} alt="Gatsby Docs are awesome" />
                    <div className="overlay"></div>
                  </div>
                ) : (
                  <div className="overlayWrapper">
                    <div className="rect"></div>
                    <div className="overlay"></div>
                  </div>
                )}

                <div className="blogContent">
                  <span className="blogDate">{moment(post.date).format(`MMM Do YYYY`)}</span>
                  <h1 className="blogTitle">{ReactHtmlParser(post.title)}</h1>
                  {/* <div className="blogLink" to={"/blog/"+post.slug}>Read More</div> */}
                  {/* <div className="blogP">{ReactHtmlParser(post.excerpt.slice(0, 150) + '...')}</div> */}
                </div>

              </Blog>
            </Link>
          ))}
        </div>
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
        link
        seo {
          title
          metaDesc
          focuskw
        }
        posts(first: 500) {
          nodes {
            id
            slug
            date
            title
            excerpt
            uri
            featuredImage {
              sourceUrl
              mediaItemId
              modified
              imageFile {
                childImageSharp {
                  fluid(maxWidth: 650, maxHeight: 400, quality: 70) {
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
                width
                height
              }
            }
          }
        }
      }
    }
  }
`