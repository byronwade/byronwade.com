import React from "react"
import moment from "moment"
//import { Link } from "gatsby"
import ComponentParser from "../components/ComponentParser"

import Layout from "../components/layout"
//import Image from "../components/image"
import SEO from "../components/seo"

const Post = ({pageContext}) => (
    
    <Layout>
      <SEO title={pageContext.title} />
        <div>
            <h1>{pageContext.title}</h1>
            <div>{moment(new Date(pageContext.date)).format("MM/DD/YYYY")}</div>
            <ComponentParser content={pageContext.blocks} />
        </div>
    </Layout>
  )

export default Post