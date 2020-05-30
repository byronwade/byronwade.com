//Import for code parts of react and gatsby
import React from "react" //react core
import { useStaticQuery, graphql } from "gatsby" //gatsby
//import Img from "gatsby-image" //gatsbys image API
import ReactHtmlParser from 'react-html-parser'; //parse html

//Link import to check if internal or external link
import Link from "../utils/links" //custom links

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
    <footer className="menu">
      {data.wordpress.menus.nodes.map(({menuItems, AFCFooterInfoMenu}, i) => (
        <div key={i} className="footer">
          <div>{ReactHtmlParser(AFCFooterInfoMenu.email)}</div>
          <div>{ReactHtmlParser(AFCFooterInfoMenu.phoneNumber)}</div>
          {menuItems.nodes.map(menuItems => (
            <Link activeClassName="active" key={menuItems.id} to={(menuItems.connectedObject.url ? menuItems.url : (menuItems.connectedObject.__typename === "WORDPRESS_Post" ? '/blog/'+menuItems.connectedObject.uri : (menuItems.connectedObject.url === "/" ? '/' : "/"+menuItems.connectedObject.uri)))}>
              {menuItems.title || menuItems.label}
            </Link>
          ))}
          © {new Date().getFullYear()}, Built by {ReactHtmlParser(AFCFooterInfoMenu.copywrite)}, Built with <a href="https://www.gatsbyjs.org">Gatsby</a>, <a href="https://www.gatsbyjs.org">React</a>, <a href="https://www.gatsbyjs.org">WP-GraphQL</a>
        </div>
      ))}
    </footer>
  )
  
}

export default Footer
