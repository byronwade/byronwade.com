import React, { useEffect } from 'react'

type SeparatorComponentProps = {
  attributes: {
    className: string
    color: string
  }
  name: string
  className: string
  color: string
}

const SeparatorComponent = ({
    name,
    className,
    color,
}: SeparatorComponentProps) => {

  
  if(name) {
    return (
      <hr className={className} />
    )
  }
  return null;
}

export default SeparatorComponent
