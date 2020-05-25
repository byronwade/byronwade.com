import { graphql } from "gatsby";

export const SpacerBlockInfo = graphql`
	fragment SpacerBlockInfo on WORDPRESS_CoreSpacerBlock {
		attributes {
			spacerHeight: height
			className
		}
		name
	}
`;
