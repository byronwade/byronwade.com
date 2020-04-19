import React, { useState } from "react"

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
      <code>{content}</code>
    )
  }
  return null;
}

export default CodeComponent
