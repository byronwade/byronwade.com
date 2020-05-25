import React from "react";
import Block from "./AllBlocks";
import { randomID } from "../utils/helpers";
import ReactHtmlParser from "react-html-parser"; //parse html

//Import Fragment queries
import "../blocks/blockFragments/core/Header";
import "../blocks/blockFragments/core/List";
import "../blocks/blockFragments/core/Paragraph";
import "../blocks/blockFragments/core/Image";
import "../blocks/blockFragments/core/Code";
import "../blocks/blockFragments/core/Youtube";
import "../blocks/blockFragments/core/HTML";
import "../blocks/blockFragments/core/Separator";
import "../blocks/blockFragments/core/Spacer";
import "../blocks/blockFragments/core/Quote";
import "../blocks/blockFragments/core/ShortCodes";

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
