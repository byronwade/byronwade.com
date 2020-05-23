import React from 'react'
import ReactHtmlParser from 'react-html-parser'; //parse html

type QuoteComponentProps = {
  attributes: {
    align
    citation
    className
    value
  }
  name
  align
  citation
  className
  value
}

const QuoteComponent = ({
    name,
    value,
    className,
    citation
}: QuoteComponentProps) => {
  
  if(name) {
    return (
      <blockquote className={className}>
        <div className="quote">
          {ReactHtmlParser(value)}
        </div>
        <small className="citation">{citation}</small>
      </blockquote>
    )
  }
  return null;
}

export default QuoteComponent
