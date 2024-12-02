export const getBlogPostsQuery = `#graphql
  query GetBlogPosts($first: Int!, $after: String) {
    blog(handle: "news") {
      id
      handle
      title
      articles(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            handle
            excerpt
            publishedAt
            content
            image {
              url(transform: {maxWidth: 1200, maxHeight: 800, crop: CENTER})
              altText
              width
              height
            }
            author {
              name
            }
          }
        }
      }
    }
  }
`;

export const getBlogHandleQuery = `#graphql
  query GetBlogHandle {
    blogs(first: 1) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
  }
`;

export const listBlogsQuery = `#graphql
  query ListBlogs {
    blogs(first: 10) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
  }
`;
