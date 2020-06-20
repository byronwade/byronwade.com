import React from "react"
import styled, { ThemeProvider, createGlobalStyle } from "styled-components"

import Header from "./header"
import Footer from "./footer"
import "../../styles/layout.scss"

const theme = {
  dark: {
    colors: {
      text: '#EAE0D5',
      background: '#333132',
    },
  },
  light: {
    colors: {
      text: '#EAE0D5',
      background: '#333132',
    },
  }
};

const GlobalStyles = createGlobalStyle`
  body {
    color: ${props => props.theme.dark.colors.text};
    background: ${props => props.theme.dark.colors.background};
  }
`

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Header />
        <main className="container main">{children}</main>
      <Footer />
    </ThemeProvider>
  )
}

export default Layout
