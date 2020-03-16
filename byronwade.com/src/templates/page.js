import React from "react"
//import { Link } from "gatsby"

import Layout from "../../components/body/layout"

const PageTemplate = ({ pageContext }) => (
  <Layout>
    <SEO title='test'/>
    <pre>{JSON.stringify(pageContext, null, 4)}</pre>
  </Layout>
)

export default PageTemplate