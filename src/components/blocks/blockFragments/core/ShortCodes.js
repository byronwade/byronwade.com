import { graphql } from "gatsby";

export const ShortCodesBlockInfo = graphql`
	fragment ShortCodesBlockInfo on WORDPRESS_CoreShortcodeBlock {
		parentId
		originalContent
		name
	}
`;
