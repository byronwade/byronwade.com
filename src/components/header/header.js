//Import for code parts of react and gatsby
import React from "react" //react core
import { useStaticQuery, graphql } from "gatsby" //gatsby
//import Img from "gatsby-image" //gatsbys image API

//Link import to check if internal or external link
import Link from "../utils/links" //custom links

const Header = () => {
  const data = useStaticQuery(graphql`
    {
      wordpress {
        menuItems(where: {location: PRIMARY}) {
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
  `)

  return (
    <header>
      <div className="menu">
        {data.wordpress.menuItems.nodes.map(menuItems => (
          <Link activeClassName="active" key={menuItems.id} to={(menuItems.connectedObject.url ? menuItems.url : (menuItems.connectedObject.__typename === "WORDPRESS_Post" ? '/blog/'+menuItems.connectedObject.uri : (menuItems.connectedObject.url === "/" ? '/' : "/"+menuItems.connectedObject.uri)))}>
            {menuItems.title || menuItems.label}
          </Link>
        ))}
      </div>
    </header>
  )
  
}

export default Header
