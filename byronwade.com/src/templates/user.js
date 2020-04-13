import React from "react"
import { graphql } from 'gatsby'

import Layout from "../components/body/layout"
import moment from "moment/moment"

import Link from "../utils/links"

const User = props => {
const {
  data: {
    wordpress: { user },
  },
} = props
const { uri, name, posts, avatar } = user

  return (
    <Layout>
        {/* <h1>All Props</h1>
        <pre>{JSON.stringify(props, null, 4)}</pre>

        <h1>Pulling Data Out</h1>
        <pre>{JSON.stringify(uri, null, 4)}</pre>
        <pre>{JSON.stringify(name, null, 4)}</pre> */}
        <img src={avatar.url} alt="" />
        <h1>{name}</h1>
        <small>{moment().format(`MMM Do YYYY`)}</small>
        {
          posts.nodes.map(post => (
              <div key={post.id}>
                {/* <pre>{JSON.stringify(post.featuredImage, null, 4)}</pre> */}
                <h1>{post.title}</h1>
                <small>{post.date}</small>
                <div dangerouslySetInnerHTML={{__html: post.excerpt}} />
                <Link to={"/blog/"+post.uri}>Read More</Link>
              </div>
          ))
        }
    </Layout>
  )
 }



export default User

export const pageQuery = graphql`
  query GET_USER($id: ID!) {
    wordpress {
      user(id: $id) {
        uri
        name
        posts {
          nodes {
            id
            title
            date
            excerpt
            slug
            title
            uri
          }
        }
        avatar {
          url
        }
      }
    }
  }
`

// export const pageQuery = graphql`
//   query GET_USER($id: ID!) {
//     wordpress {
//       user(id: $id) {
//         uri
//         name
//         posts {
//           nodes {
//             id
//             title
//             date
//             excerpt
//             slug
//             title
//             uri
//           }
//         }
//       }
//     }
//   }
// `