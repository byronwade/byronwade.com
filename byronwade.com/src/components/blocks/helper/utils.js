import React from 'react';
//Import Blocks
import Heading from "../core/Header"
import Paragraph from "../core/Paragraph"
import List from "../core/List"


export const blockToComponent = (block) => {
    let component;
  
    switch(block.name) {
      case "core/heading":
        component = <Heading {...block} {...block.data} {...block.attributes} />
        break;
      case "core/paragraph":
        component = <Paragraph {...block} {...block.data} {...block.attributes} />
        break;
      case "core/list":
        component = <List {...block} {...block.data} {...block.attributes} />
        break;
      default:
        component = null;
    }
  
    return component;
  }

  