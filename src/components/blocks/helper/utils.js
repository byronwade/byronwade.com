import React from 'react';
//Import Blocks
import Heading from "../core/Header"
import Paragraph from "../core/Paragraph"
import List from "../core/List"
import Image from "../core/Image"
import Code from "../core/Code"
import YouTube from "../core/Youtube"
import HTML from "../core/HTML"
import Separator from "../core/Separator"
import Spacer from "../core/Spacer"
import Quote from "../core/Quote"


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
      case "core/image":
        component = <Image {...block} {...block.data} {...block.attributes} />
        break;
      case "core/code":
        component = <Code {...block} {...block.data} {...block.attributes} />
        break;
      case "core-embed/youtube":
        component = <YouTube {...block} {...block.data} {...block.attributes} />
        break;
      case "core/html":
        component = <HTML {...block} {...block.data} {...block.attributes} />
        break;
      case "core/separator":
        component = <Separator {...block} {...block.data} {...block.attributes} />
        break;
      case "core/spacer":
        component = <Spacer {...block} {...block.data} {...block.attributes} />
        break;
      case "core/quote":
        component = <Quote {...block} {...block.data} {...block.attributes} />
        break;
      default:
        component = null;
    }
  
    return component;
  }

  