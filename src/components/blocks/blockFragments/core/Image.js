import { graphql } from "gatsby";

export const FeaturedImageInfo = graphql`
	fragment FeaturedImageInfo on WORDPRESS_Page {
		featuredImage {
			sourceUrl
			mediaItemId
			modified
			imageFile {
				childImageSharp {
					fluid(maxWidth: 650) {
						base64
						aspectRatio
						src
						srcSet
						sizes
					}
				}
			}
		}
	}
`;

export const ImageBlockInfo = graphql`
	fragment ImageBlockInfo on WORDPRESS_CoreImageBlock {
		attributes {
			url
			alt
			className
			caption
			sizeSlug
			height
			href
		}
		name
		originalContent
	}
`;
