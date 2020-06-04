import React from "react"
import { Helmet } from "react-helmet"

import Header from "./header"
import Footer from "./footer"
import "../../styles/layout.scss"

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
