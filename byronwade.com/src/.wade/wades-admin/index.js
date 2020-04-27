/*
simple page to help quickly edit and configure gatsby/wordpress site, 
this will help install gatsby and configure all the pages, along with changing settings 
in the wade.config.js files. Without ever having to touch the code
*/

//Import for code parts of react and gatsby
import React from "react" //reacts core
const { themeDetails } = require('../theme-selector')
//import { graphql } from 'gatsby' //gatsbys graphql setup
//import moment from "moment/moment" //date formatting
//import Img from "gatsby-image" //gatsby image API

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links


const Admin = () => {

  return (
    <html className={themeDetails.themeName}>
      <link rel="stylesheet" type="text/css" href={themeDetails.absolutePath} />
      <h1>Admin Panel</h1>
      <p>All the config data will be here where users can change how their website works, by changing the plugins data, and default config data.</p>
    </html>
  )
 }

export default Admin