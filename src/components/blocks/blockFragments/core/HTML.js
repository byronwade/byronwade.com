import { graphql } from "gatsby";

export const HTMLBlockInfo = graphql`
	fragment HTMLBlockInfo on WORDPRESS_CoreHtmlBlock {
		originalContent
		name
	}
`;
