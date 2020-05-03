
import { graphql } from "gatsby"

export const ParagraphBlockInfo = graphql`
  fragment ParagraphBlockInfo on WORDPRESS_CoreParagraphBlock {
    attributes {
        ... on WORDPRESS_CoreParagraphBlockAttributesV3 {
          className
          content
        }
      }
      isValid
      originalContent
      name
  }
`


