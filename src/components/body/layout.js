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
      text: '#333132',
      background: '#fff',
    },
  }
};

const GlobalStyles = createGlobalStyle`
  body {
    color: ${props => props.theme.dark.colors.text};
    background: ${props => props.theme.dark.colors.background};
  }
  .grid {
    display: grid;
    grid-auto-columns: max-content;
    grid-auto-flow: dense;
    grid-auto-rows: minmax(100px, auto);
    grid-template-columns: repeat(3, 1fr);
    margin: 1em auto;
    .gridItem {
      grid-column: span 1;
      grid-row: span 1;
      &:nth-of-type(3n + 1) {
        grid-column: span 2;
      }
    }
  }
`
const Main = styled.main`
  padding-top: 73px;
  position: relative;
  min-height: 100vh;
`;

const Layout = ({ children }) => {

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Header />
        <Main className="container">{children}</Main>
      <Footer/>
    </ThemeProvider>
  )
}

export default Layout
