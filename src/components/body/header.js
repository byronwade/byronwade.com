//Import for code parts of react and gatsby
import React from "react" //react core
import { useStaticQuery, graphql } from "gatsby" //gatsby
import Img from "gatsby-image" //gatsbys image API
import ReactHtmlParser from 'react-html-parser'; //parse html
import styled from "styled-components"

//Link import to check if internal or external link
import Link from "../utils/links" //custom links

const Header = () => {
  const data = useStaticQuery(graphql`
  {
    wordpress {
      menus(where: {location: PRIMARY}) {
        nodes {
          AFCLogoContactMenu {
            email
            fieldGroupName
            phoneNumber
            logo {
              sourceUrl
              mediaItemId
              modified
              imageFile {
                childImageSharp {
                  fluid(maxWidth: 25) {
                    base64
                    aspectRatio
                    src
                    srcSet
                    sizes
                  }
                }
              }
            }
            logoLink {
              url
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
  `);


  const Menu = styled.header`
    position: fixed;
    width: 100%;
    top:0;
    left:0;
    background: #333132;
    z-index: 100;
    box-shadow: 0 1px 0px rgba(0,0,0,0.16), 0 0px 0px rgba(0,0,0,0.23);
    .menuItem {
      color:#EAE0D5;
      border-radius: 5px;
      padding:10px;
      &:hover {
        color:#fff;
        text-decoration:underline;
      }
    }
    .menuItem.active {
      padding:5px 10px;
      background:#FFBD1B;
      color:#333132;
      &:hover{
        text-decoration:none;
      }
    }
  `;

  return (
    <Menu>
      {data.wordpress.menus.nodes.map(({menuItems, AFCLogoContactMenu}, i) => (
        <div key={i} className="header">
          <div className="header-left">
            {AFCLogoContactMenu.logo ? (
              <div className="logo">
                <Link to={AFCLogoContactMenu.logoLink.url}>
                    <Img imgStyle={{ objectFit: "contain" }} style={{ width: "35px", height: "35px" }} className="logo-image" fluid={AFCLogoContactMenu.logo.imageFile.childImageSharp.fluid} alt='Gatsby Docs are awesome' />
                </Link>
              </div>
            ) : null}
            <div className="contactInfo">
              <div>{ReactHtmlParser(AFCLogoContactMenu.email)}</div>
              <div>{ReactHtmlParser(AFCLogoContactMenu.phoneNumber)}</div>
            </div>
          </div>
          <div className="header-right">
            {menuItems.nodes.map(menuItems => (
              <Link className="menuItem" activeClassName="active" key={menuItems.id} to={(menuItems.connectedObject.url ? menuItems.url : (menuItems.connectedObject.__typename === "WORDPRESS_Post" ? '/blog/'+menuItems.connectedObject.uri : (menuItems.connectedObject.url === "/" ? '/' : menuItems.connectedObject.uri)))}>
                {menuItems.title || menuItems.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </Menu>
  )
  
}

export default Header
