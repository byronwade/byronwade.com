import { graphql } from "gatsby"

export const CodeBlockInfo = graphql`
  fragment YouTubeBlockInfo on WORDPRESS_CoreEmbedYoutubeBlock {
    parentId
    attributes {
      className
      url
    }
    name
  }
`