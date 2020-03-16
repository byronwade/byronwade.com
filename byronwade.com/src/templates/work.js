import React from "react"

import Layout from "../components/body/layout"

const Work = ({pageContext}) => (
    
    <Layout>
        <pre>{JSON.stringify(pageContext, null, 4)}</pre>
    </Layout>
  )

export default Work