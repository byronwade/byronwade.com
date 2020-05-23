import React from "react"
import ReactHtmlParser from 'react-html-parser';

type ParagraphProps = {
  attributes?: {
    className: string
    content: string
  }
  children?: any
  className?: string
  content?: string
  isValid?: boolean
  originalContent?: string
  name?: string
}

const Paragraph = ({
  children,
  className,
  content,
}: ParagraphProps) => {

  let paragraphClass = ``
  paragraphClass = className && paragraphClass + ` ` + className
  const innerContent = content ? content : children

  return (
    <p className={paragraphClass}>
      {ReactHtmlParser(innerContent)}
    </p>
  )
}

export default Paragraph