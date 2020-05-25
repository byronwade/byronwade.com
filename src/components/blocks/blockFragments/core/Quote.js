import { graphql } from "gatsby";

export const QuoteBlockInfo = graphql`
	fragment QuoteBlockInfo on WORDPRESS_CoreQuoteBlock {
		attributes {
			align
			citation
			className
			value
		}
		name
	}
`;
