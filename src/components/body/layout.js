import React from "react"

import Header from "../header/header"
import Footer from "../footer/footer"
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
