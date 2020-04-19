import { graphql } from "gatsby"

export const SeparatorBlockInfo = graphql`
  fragment SeparatorBlockInfo on WORDPRESS_CoreSeparatorBlock {
    attributes {
      className
      color
    }
    name
  }
`