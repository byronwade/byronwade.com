import React from "react"
import { graphql } from 'gatsby'
import SEO from "../components/header/seo"
import Layout from "../components/body/layout"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Pages</h1>
    {data.wordpress.pages.nodes.map(pages => (
      <p key={pages.id}>{pages.slug}</p>
    ))}

    <h1>Posts</h1>
    {data.wordpress.posts.nodes.map(posts => (
      <p key={posts.id}>{posts.slug}</p>
    ))}

    <h1>Tags</h1>
    {data.wordpress.tags.nodes.map(tags => (
      <p key={tags.id}>{tags.slug}</p>
    ))}

    <h1>Users</h1>
    {data.wordpress.users.nodes.map(users => (
      <p key={users.id}>{users.slug}</p>
    ))}

    <h1>Works</h1>
    {data.wordpress.works.nodes.map(works => (
      <p key={works.id}>{works.slug}</p>
    ))}

    <h1>Categories</h1>
    {data.wordpress.categories.nodes.map(categories => (
      <p key={categories.id}>{categories.slug}</p>
    ))}

    <h1>Cases</h1>
    {data.wordpress.cases.nodes.map(cases => (
      <p key={cases.id}>{cases.slug}</p>
    ))}


  </Layout>
)


export const query = graphql`
{
  wordpress {
    pages {
      nodes {
        id
        slug
      }
    }
    posts {
      nodes {
        id
        slug
      }
    }
    tags {
      nodes {
        id
        slug
      }
    }
    users {
      nodes {
        id
        slug
      }
    }
    works {
      nodes {
        id
        slug
      }
    }
    categories {
      nodes {
        id
        slug
      }
    }
    cases {
      nodes {
        id
        slug
      }
    }
  }
}
`

export default IndexPage
