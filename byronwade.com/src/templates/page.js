import React from "react"

import Layout from "../components/body/layout"

const PageTemplate = ({ pageContext }) => (
  <Layout>
    <pre>{JSON.stringify(pageContext, null, 4)}</pre>
  </Layout>
)

export default PageTemplate