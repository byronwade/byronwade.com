import React from "react";

//Import Blocks//
//Core Blocks
import Heading from "./blockComponents/core/Header";
import Paragraph from "./blockComponents/core/Paragraph";
import List from "./blockComponents/core/List";
import Image from "./blockComponents/core/Image";
import Code from "./blockComponents/core/Code";
import YouTube from "./blockComponents/core/Youtube";
import HTML from "./blockComponents/core/HTML";
import Separator from "./blockComponents/core/Separator";
import Spacer from "./blockComponents/core/Spacer";
import Quote from "./blockComponents/core/Quote";
import ShortCodes from "./blockComponents/core/ShortCodes";
//AFC Blocks
import AFCHomeBlock from "./blockComponents/afc/AFCHomeBlock";

export default ({ block }) => blockToComponent(block);

export const blockToComponent = (block) => {
	let component;

	switch (block.name) {
		case "core/heading":
			component = <Heading {...block} {...block.data} {...block.attributes} />;
			break;
		case "core/paragraph":
			component = <Paragraph {...block} {...block.data} {...block.attributes} />;
			break;
		case "core/list":
			component = <List {...block} {...block.data} {...block.attributes} />;
			break;
		case "core/image":
			component = <Image {...block} {...block.data} {...block.attributes} />;
			break;
		case "core/code":
			component = <Code {...block} {...block.data} {...block.attributes} />;
			break;
		case "core-embed/youtube":
			component = <YouTube {...block} {...block.data} {...block.attributes} />;
			break;
		case "core/html":
			component = <HTML {...block} {...block.data} {...block.attributes} />;
			break;
		case "core/separator":
			component = <Separator {...block} {...block.data} {...block.attributes} />;
			break;
		case "core/spacer":
			component = <Spacer {...block} {...block.data} {...block.attributes} />;
			break;
		case "core/quote":
			component = <Quote {...block} {...block.data} {...block.attributes} />;
			break;
		case "core/shortcode":
			component = <ShortCodes {...block} {...block.data} {...block.attributes} />;
			break;

			//AFC Blocks
		case "acf/home":
			component = <AFCHomeBlock {...block} {...block.data} {...block.attributes} />;
			break;

			
		default:
			component = null;
	}

	return component;
};