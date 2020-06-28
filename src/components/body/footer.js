//Import for code parts of react and gatsby
import React from "react" //react core
import { globalHistory as history } from '@reach/router'
import Img from "gatsby-image" //gatsby image API
import { useStaticQuery, graphql } from "gatsby" //gatsby
//import Img from "gatsby-image" //gatsbys image API
import ReactHtmlParser from 'react-html-parser'; //parse html
import styled from "styled-components"

//Link import to check if internal or external link
import Link from "../utils/links" //custom links

const { location } = history //get current location for page
const pageLocation = location.pathname

const FooterSection = styled.footer`
  width: 100%;
  .cta {
    width: 100%;
    color: #EAE0D5;
    position: relative;
    border-radius: 5px;
    max-width: 1140px;
    margin: 2em auto 5em auto;
    padding: 15px;
    .ctaContent {
      position: absolute;
      width: 100%;
      z-index: 100;
      padding: 3em;
      height: 100%;
    }
    .ctaHeader {
      font-size:50px;
      font-weight: bold;
      line-height: 72px;
    }
    .ctaP {
      font-size:17px;
    }
    .ctaButton {
      font-size: 18px;
      color: #fff;
      padding: 0.5em 3em;
      background: #9D6DD8;
      position: absolute;
      top: 78px;
      right: 120px;
      font-weight: bold;
    }
    .ctaPhoto {
      border-radius: 5px;
    }
  }
  .bottomCopy {
    width:100%;
    background: #232323;
    .bottomWrapper {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 2em 15px;
      max-width: 1140px;
      margin: 0 auto;
      .menuItem {
        color:#EAE0D5;
        border-radius: 5px;
        padding:10px;
        &:hover {
          color:#fff;
          text-decoration:underline;
        }
      }
    }
    .copy {
      flex: 2 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .contactInfo {
      flex: 1 1;
      align-items: start;
      margin-right: auto;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
    }
    .socialInfo {
      flex: 1 1;
      align-items: center;
      margin-right: auto;
      display: flex;
      justify-content: flex-end;
    }
  }
`;


const Footer = () => {
  const data = useStaticQuery(graphql`
  {
    wordpress {
      menus(where: {location: FOOTER}) {
        nodes {
          AFCFooterInfoMenu {
            copywrite
            email
            phoneNumber
          }
          AFCFooterLetsGetStarted {
            header
            subHeader
            backgroundImage {
              sourceUrl
              mediaItemId
              modified
              imageFile {
                childImageSharp {
                  fluid(quality: 100) {
                    base64
                    aspectRatio
                    src
                    srcSet
                    sizes
                  }
                }
              }
            }
            button {
              url
              title
            }
          }
          menuItems {
            nodes {
              id
              title
              label
              url
              connectedObject {
                ... on WORDPRESS_Post {
                  uri
                }
                ... on WORDPRESS_Page {
                  uri
                }
                ... on WORDPRESS_Work {
                  uri
                }
                ... on WORDPRESS_Casestudy {
                  uri
                }
                ... on WORDPRESS_Category {
                  uri
                }
                ... on WORDPRESS_Tag {
                  uri
                }
                ... on WORDPRESS_MenuItem {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
  `)

  return (
    <FooterSection>

      {data.wordpress.menus.nodes.map(({menuItems, AFCFooterInfoMenu, AFCFooterLetsGetStarted}, i) => (
        <div key={i} className="footer">

          {pageLocation === "/contact/" ? null : (
            <div className="cta">
              <div className="ctaContent">
                <div className="ctaHeader">{ReactHtmlParser(AFCFooterLetsGetStarted.header)}</div>
                <div className="ctaP">{ReactHtmlParser(AFCFooterLetsGetStarted.subHeader)}</div>
                <Link className="ctaButton" to={AFCFooterLetsGetStarted.button.url}>{ReactHtmlParser(AFCFooterLetsGetStarted.button.title)}</Link>
              </div>
              <Img className="ctaPhoto" fluid={AFCFooterLetsGetStarted.backgroundImage.imageFile.childImageSharp.fluid} alt="Gatsby Docs are awesome" />
            </div>
          )}

          <div className="bottomCopy">
            <div className="bottomWrapper">
              <div className="copy">
                © {new Date().getFullYear()}, Built by {ReactHtmlParser(AFCFooterInfoMenu.copywrite)}, Built with <a href="https://www.gatsbyjs.org">Gatsby</a>, <a href="https://www.gatsbyjs.org">React</a>, <a href="https://www.gatsbyjs.org">WP-GraphQL</a>
              </div>
              <div className="contactInfo">
                <div className="contactEmail">E: {ReactHtmlParser(AFCFooterInfoMenu.email)}</div>
                <div className="contactPhone">P: {ReactHtmlParser(AFCFooterInfoMenu.phoneNumber)}</div>
              </div>
              <div className="socialInfo">
                {menuItems.nodes.map(menuItems => (
                  <Link className="menuItem" activeClassName="active" key={menuItems.id} to={(menuItems.connectedObject.url ? menuItems.url : (menuItems.connectedObject.__typename === "WORDPRESS_Post" ? '/blog/'+menuItems.connectedObject.uri : (menuItems.connectedObject.url === "/" ? '/' : "/"+menuItems.connectedObject.uri)))}>
                    {menuItems.title || menuItems.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </FooterSection>
  )
  
}

export default Footer
