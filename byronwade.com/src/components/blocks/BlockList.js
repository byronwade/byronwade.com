import React from 'react';
import Block from './Block';
import { randomID } from "../utils/helpers"

export default ({blocks}) => {
    return <>
        {blocks ? blocks.map(block => (
            <Block key={`component-${randomID()}`} block={block} />
        )) : null}
    </>
}