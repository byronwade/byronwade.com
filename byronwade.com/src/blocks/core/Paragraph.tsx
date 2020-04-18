import React from "react"

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
      {innerContent}
    </p>
  )
}

export default Paragraph