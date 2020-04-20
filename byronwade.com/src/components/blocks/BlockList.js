import React from 'react';
import Block from './Block';
import { randomID } from "../utils/helpers"
import ReactHtmlParser from 'react-html-parser'; //parse html

export default ({blocks, content}) => {
    console.log(blocks.length)
    return <>
    {blocks.length > 3 ? (
        blocks.map(block => (<Block key={`component-${randomID()}`} block={block} />))
    ) : (
        console.log("This is showing because this page is showing content from wordpress core query and not using the blocks query"),
        ReactHtmlParser(content)
    )}
    </>
}