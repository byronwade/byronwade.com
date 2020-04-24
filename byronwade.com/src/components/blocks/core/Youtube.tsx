import React from "react"
import LazyLoad from 'react-lazyload';
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
      <LazyLoad placeholder={<img src="https://via.placeholder.com/560x315" alt="Image Place Holder" />}>
        <iframe width="560" height="315" className={className} src={`//www.youtube.com/embed/`+YouTubeGetID(url)} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </LazyLoad>
    )
  }
  return null;
}

export default YouTubeComponent
