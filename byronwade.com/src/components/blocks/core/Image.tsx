import React from "react"
import LazyLoad from 'react-lazyload';
//import Img from "gatsby-image" //gatsby image API

type ImageLoaderProps = {
  alt: string
  className?: string
  height?: number
  url?: string
  title?: string
  caption?: string
  width?: number
}

const Image = ({
  alt,
  className,
  height,
  url,
  title,
  caption,
  width,
}: ImageLoaderProps) => {
  const imageAlt = alt || title || caption || "This is a default alt text"
  return (
    <LazyLoad height={height ? height : null}>
      <img width={width} height={height} alt={imageAlt} className={className} src={url} />
    </LazyLoad>
  )
}

export default Image


// Example of image block properties:
// {
//   "attributes": {
//     "url": "http://64.225.119.202/wp-content/uploads/2020/01/72bbde02-e390-3901-bf2b-4a37882f9c18.jpg",
//     "alt": "",
//     "className": null,
//     "caption": "",
//     "sizeSlug": null,
//     "height": null,
//     "href": null
//   },
//   "name": "core/image",
//   "originalContent": "<div class=\"wp-block-image\"><figure class=\"aligncenter\"><img src=\"http://64.225.119.202/wp-content/uploads/2020/01/72bbde02-e390-3901-bf2b-4a37882f9c18.jpg\" alt=\"\"/></figure></div>"
// }