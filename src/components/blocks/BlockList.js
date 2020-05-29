import React from "react";
import Block from "./AllBlocks";
import { randomID } from "../utils/helpers";
import ReactHtmlParser from "react-html-parser"; //parse html

//Import Fragment queries//
// Core Bocks
import "./blockFragments/core/List";
import "./blockFragments/core/Paragraph";
import "./blockFragments/core/Image";
import "./blockFragments/core/Code";
import "./blockFragments/core/Youtube";
import "./blockFragments/core/HTML";
import "./blockFragments/core/Separator";
import "./blockFragments/core/Spacer";
import "./blockFragments/core/Quote";
import "./blockFragments/core/ShortCodes";
// AFC Blocks
import "./blockFragments/afc/AFCHomeBlock";

export default ({ blocks, content }) => {
	//console.log(blocks.length)
	return (
		<>
			{blocks.length > 1
				? blocks.map((block) => (
						<Block key={`component-${randomID()}`} block={block} />
				  ))
				: //console.log("This is showing because this page is showing content from wordpress core query and not using the blocks query"),
				  ReactHtmlParser(content)}
		</>
	);
};
