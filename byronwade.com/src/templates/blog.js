import React from "react"
import moment from "moment"
import { Link } from "gatsby"

import Layout from "../components/layout"
//import Image from "../components/image"
import SEO from "../components/seo"

const Blog = ({pageContext}) => (
    
  <Layout>
    <SEO title='{pageContext.title}' />
    {pageContext.posts.map(post => (
        <div key={post.id}>
            <h3 dangerouslySetInnerHTML={{__html: post.title}} />
            <small>
                {moment(new Date(post.date)).format("MM/DD/YYYY")}
            </small>
            <p dangerouslySetInnerHTML={{__html: post.excerpt}} />
            <div>
                <Link to={`/blog/${post.slug}`}>
                    Read more
                </Link>
            </div>
        </div>
    ))}
    <div>
        {Array.from({length: pageContext.numberOfPages}).map((page, index) => (
            <div key={index}>
                {index === 0 ? '' : (
                    <Link activeClassName="active" to={index === 0 ? '/blog' : `/blog/${index + 1}`}>
                        {index + 1}
                    </Link>
                )}
            </div>
        ))}
    </div>
  </Layout>
  )

export default Blog