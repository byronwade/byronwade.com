import React from "react"

type CodeComponentProps = {
  attributes: {
    className: string
    content: string
  }
  originalContent: string
  name: string
  className: string
  content: string
}

const CodeComponent = ({
    originalContent,
    name,
    className,
    content
}: CodeComponentProps) => {

  if(content) {
    return (
      <code className={className}>{content}</code>
    )
  }
  return null;
}

export default CodeComponent
