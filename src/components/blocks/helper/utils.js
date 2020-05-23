import React from 'react';
//Import Blocks
import Heading from "../core/Header.tsx"
import Paragraph from "../core/Paragraph.tsx"
import List from "../core/List.tsx"
import Image from "../core/Image.tsx"
import Code from "../core/Code.tsx"
import YouTube from "../core/Youtube.tsx"
import HTML from "../core/HTML.tsx"
import Separator from "../core/Separator.tsx"
import Spacer from "../core/Spacer.tsx"
import Quote from "../core/Quote.tsx"


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

  