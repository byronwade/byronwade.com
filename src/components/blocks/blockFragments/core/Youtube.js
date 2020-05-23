import { graphql } from "gatsby"

export const YouTubeBlockInfo = graphql`
  fragment YouTubeBlockInfo on WORDPRESS_CoreEmbedYoutubeBlock {
    parentId
    attributes {
      className
      url
    }
    name
  }
`