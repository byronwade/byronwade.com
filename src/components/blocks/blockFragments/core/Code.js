import { graphql } from "gatsby"

export const CodeBlockInfo = graphql`
  fragment CodeBlockInfo on WORDPRESS_CoreCodeBlock {
    attributes {
        className
        codeContent: content
      }
      originalContent
      name
  }
`

//alias 'codeContent' used for property content because:
// There was an error in your GraphQL query:

// Fields "attributes" conflict because subfields "content" conflict because they return conflicting types String! and String. Use different aliases on the fields to fetch both if this was intentional.