import React from 'react';
import Block from './Block';
import { randomID } from "../utils/helpers"

export default ({blocks}) => {
    return <>
        {blocks ? blocks.map(block => (
            <div key={`component-${randomID()}`}>
                <Block block={block} />
            </div>
        )) : null}
    </>
}