import { graphql } from "gatsby";

export const ACFHomeBlock = graphql`
	fragment ACFHomeBlock on WORDPRESS_AcfHomeBlock {
    acf {
      pre_header
      header
      description
      second_button {
        title
        url
      }
      first_button {
        title
        url
      }
      logo {
        sourceUrl
        mediaItemId
        modified
        imageFile {
          childImageSharp {
            fluid(base64Width: 10) {
              base64
              aspectRatio
              src
              srcSet
              sizes
            }
          }
        }
      }
      name
      tagline
      what_i_do
      where_i_am_from
    }
    name
  }
`;
