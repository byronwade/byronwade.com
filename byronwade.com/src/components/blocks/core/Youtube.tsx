import React from "react"

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

    function getId(url) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);

      if (match && match[2].length == 11) {
          return match[2];
      } else {
          return 'error';
      }
    }
    return (
      <iframe width="560" height="315" className={className} src={`//www.youtube.com/embed/`+getId(url)} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    )
  }
  return null;
}

export default YouTubeComponent
