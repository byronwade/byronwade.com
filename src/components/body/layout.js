import React from "react"
import { Helmet } from "react-helmet"

import Header from "./header"
import Footer from "./footer"
import "../../styles/layout.scss"

const Logo = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": "http://www.example.com",
  "logo": "http://www.example.com/images/logo.png"
};

const LocalBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "image": [
    "https://example.com/photos/1x1/photo.jpg",
    "https://example.com/photos/4x3/photo.jpg",
    "https://example.com/photos/16x9/photo.jpg"
   ],
  "@id": "http://davessteakhouse.example.com",
  "name": "Dave's Steak House",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "148 W 51st St",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "postalCode": "10019",
    "addressCountry": "US"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": "Lillian Ruiz"
    }
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.761293,
    "longitude": -73.982294
  },
  "url": "http://www.example.com/restaurant-locations/manhattan",
  "telephone": "+12122459600",
  "servesCuisine": "American",
  "priceRange": "$$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday"
      ],
      "opens": "11:30",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "11:30",
      "closes": "23:00"
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
  ],
  "menu": "http://www.example.com/menu",
  "acceptsReservations": "True"
};

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Header />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(Logo)}</script>
        <script type="application/ld+json">{JSON.stringify(LocalBusiness)}</script>
      </Helmet>
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
