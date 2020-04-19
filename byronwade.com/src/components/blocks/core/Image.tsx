import React from "react"
//import Img from "gatsby-image" //gatsby image API

type ImageComponentProps = {
  attributes: {
    url: string
    alt: string
    title: string
    caption: string
    className: string
    height: string
    width: string
    id: number
  }
  url: string
  alt: string
  title: string
  caption: string
  className: string
  height: string
  width: string
  id: number
}

const ImageComponent = ({
  url,
  alt,
  title,
  caption,
  id,
  width,
  height,
  className
}: ImageComponentProps) => {
  const imageAlt = alt || title || caption || "This is a default alt text"
  if(url) {
    return (
      <img id={id} width={width} height={height} className={className} src={url} alt={imageAlt} />
    )
  }
  
}

export default ImageComponent


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