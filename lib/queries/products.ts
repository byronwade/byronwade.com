export const getAllProductsQuery = `
  query GetAllProducts {
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const getProductByHandleQuery = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
