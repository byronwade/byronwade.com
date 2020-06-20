//Import for code parts of react and gatsby
import React from "react" //react core
import Img from "gatsby-image" //gatsby image API
import { useStaticQuery, graphql } from "gatsby" //gatsby
//import Img from "gatsby-image" //gatsbys image API
import ReactHtmlParser from 'react-html-parser'; //parse html
import { globalHistory as history } from '@reach/router'

//Link import to check if internal or external link
import Link from "../utils/links" //custom links

const Footer = () => {

  const { location } = history //get current location for page

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
    <footer className="footer-menu">

      {data.wordpress.menus.nodes.map(({menuItems, AFCFooterInfoMenu, AFCFooterLetsGetStarted}, i) => (
        <div key={i} className="footer">

          {location.pathname === "/contact/" ? null : (
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
    </footer>
  )
  
}

export default Footer
