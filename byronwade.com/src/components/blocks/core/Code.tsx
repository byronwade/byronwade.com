import React, { useEffect } from 'react'
import Prism from "prismjs";

type CodeComponentProps = {
  attributes: {
    className: string
    codeContent: string
  }
  originalContent: string
  name: string
  className: string
  codeContent: string
}

const CodeComponent = ({
    originalContent,
    name,
    className,
    codeContent
}: CodeComponentProps) => {

  useEffect(() => {
    Prism.highlightAll();
  });
  
  if(codeContent) {
    return (
      <pre className={className}>
        <code>
          {codeContent}
        </code>
      </pre>
    )
  }
  return null;
}

export default CodeComponent
