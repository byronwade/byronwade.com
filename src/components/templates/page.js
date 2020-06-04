//Import for code parts of react and gatsby
import React from "react" //reacts core
import { graphql } from 'gatsby' //gatsbys graphql setup
import ReactHtmlParser from 'react-html-parser'; //parse html
//import Img from "gatsby-image" //gatsby image API
import { Helmet } from "react-helmet"

//Link import to check if internal or external link
//import Link from "../utils/links" //custom links
import SEO from "../utils/seo" //adding SEO

//Import Blocks
import BlockList from "../blocks/BlockList"

//Import Layout for pages
import Layout from "../body/layout"


const Page = props => {
const {
  data: {
    wordpress: { page, websiteGeneralSettings, generalSettings },
  },
} = props
const { title, blocks, slug, seo, link, content, isFrontPage } = page
const { dateCompanyFormed, priceRange, websiteUrl, phoneNumber, openingHours, companyName, location, logo, description } = websiteGeneralSettings.BasicWebsiteData

  const WebSite = {
    "@type":"WebSite",
    "@id":`${websiteUrl}/#webpage`,
    "url":`${websiteUrl}/`,
    "name":companyName,
    "description": description,
  }

  const WebPage = {
    "@type":"WebPage",
    "@id":`${websiteUrl}/+${slug}#webpage`,
    "url": `${websiteUrl}/+${slug}`,
    "inLanguage":"en-US",
    "name": seo.title,
    "description": seo.metaDesc,
    "isPartOf":{"@id":`${websiteUrl}/#webpage`},
      "datePublished": new Date(dateCompanyFormed).toISOString(),
      "dateModified": new Date().toISOString(),
      "description": generalSettings.description
    }

  const Logo = {
    "@type": "Organization",
    "url": `${websiteUrl}/`,
    "logo": `${websiteUrl + logo.imageFile.childImageSharp.fixed.src}`,
    "description": generalSettings.description,
    "telephone": phoneNumber
  };
  
  const LocalBusiness = {
    "@type": "LocalBusiness",
    "image": [
      logo.link
     ],
    "@id": websiteUrl,
    "name": companyName,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location.streetAddress,
      "addressLocality": location.state,
      "addressRegion": location.stateShort,
      "postalCode": location.postCode,
      "addressCountry": location.countryShort
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": location.latitude,
      "longitude": location.longitude
    },
    "url": websiteUrl,
    "telephone": phoneNumber,
    "priceRange": priceRange,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "11:30",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "16:00",
        "closes": "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "16:00",
        "closes": "22:00"
      }
    ]
  }


  const All = {
    "@context": "http://schema.org",
    "@graph": [
      WebSite, 
      WebPage, 
      Logo, 
      LocalBusiness
    ]
  }

  console.log(All)


  console.log(props)
  return (
    <Layout>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(All)}
        </script>
      </Helmet>
      <SEO title={seo.title} description={seo.metaDesc} /*image={null}*/ url={link} robots="index, follow" />
      <h1>{ReactHtmlParser(title)}</h1>
      <BlockList blocks={blocks} content={content} />
    </Layout>
  )
 }

export default Page

export const pageQuery = graphql`
  query GET_PAGE($id: ID!) {
    wordpress {
      page(id: $id) {
        isFrontPage
        slug
        title
        uri
        link
        content
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
        blocks {
          ...HeadingBlockInfo
          ...ListBlockInfo
          ...ParagraphBlockInfo
          ...ImageBlockInfo
          ...CodeBlockInfo
          ...YouTubeBlockInfo
          ...HTMLBlockInfo
          ...SeparatorBlockInfo
          ...SpacerBlockInfo
          ...QuoteBlockInfo
          ...ShortCodesBlockInfo
          ...ACFHomeBlock
        }
        seo {
          title
          metaDesc
          focuskw
        }
        author {
          name
          slug
          email
        }
      }


      websiteGeneralSettings {
        BasicWebsiteData {
          location {
            city
            country
            countryShort
            latitude
            longitude
            placeId
            postCode
            state
            stateShort
            streetAddress
            streetName
            streetNumber
            zoom
          }
          logo {
            imageFile {
              absolutePath
              nlink
              url
              childImageSharp {
                fixed {
                  src
                }
              }
            }
            sourceUrl
          }
          companyName
          openingHours {
            fieldGroupName
            closingHours {
              monday
              tusday
            }
            openingHours {
              monday
              tusday
            }
          }
          priceRange
          dateCompanyFormed
          phoneNumber
          websiteUrl
          description
        }
      }

      generalSettings {
        url
        description
      }

    }
  }
`