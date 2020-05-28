import { graphql } from "gatsby";

export const ACFIntroBlockInfo = graphql`
	fragment ACFIntroBlockInfo on WORDPRESS_AcfIntroBlock {
    attributes {
      className
      data
    }
    acf {
      test
      testing
      testing_block
    }
    name
    originalContent
    isValid
  }
`;
