import React from "react"
import { YouTubeGetID } from '../../utils/helpers'

type YouTubeComponentProps = {
  attributes: {
    className?: string
    url?: string
  }
  className?: string
  url?: string
}

const YouTubeComponent = ({
    className,
    url
}: YouTubeComponentProps) => {

  if(url) {
    return (
      <iframe width="560" height="315" className={className} src={`//www.youtube.com/embed/`+YouTubeGetID(url)} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    )
  }
  return null;
}

export default YouTubeComponent
