export const getBlogPostsQuery = `#graphql
  query GetBlogPosts($first: Int!, $after: String) {
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
          image {
            url(transform: {maxWidth: 1200, maxHeight: 800, crop: CENTER})
            altText
            width
            height
          }
          author {
            name
          }
          content
        }
      }
    }
  }
`;
