import { graphql } from "gatsby";

export const ListBlockInfo = graphql`
	fragment ListBlockInfo on WORDPRESS_CoreListBlock {
		attributes {
			className
			ordered
			reversed
			start
			type
			values
		}
		name
		originalContent
	}
`;
