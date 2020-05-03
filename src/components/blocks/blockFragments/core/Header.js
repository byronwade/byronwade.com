
import { graphql } from "gatsby"


export const HeadingBlockInfo = graphql`
  fragment HeadingBlockInfo on WORDPRESS_CoreHeadingBlock {
		attributes {
			align
			anchor
			className
			content
			level
			placeholder
		}
		name
        originalContent
        isValid
        parentId
  }
`


