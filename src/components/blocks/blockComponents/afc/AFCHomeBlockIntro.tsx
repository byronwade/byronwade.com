import React from "react";
import ReactHtmlParser from "react-html-parser";
import { Url } from "url";

type AFCHomeBlockIntroProps = {
	attributes: {
		className?: string
		data: string;
	};
	acf: {
		test?: string
		testing: string;
		testing_block: {
			title: String;
			url: String;
		}
	};
    test?: string
    testing?: string
    testing_block?: string
	isValid?: boolean;
	originalContent?: string;
	name?: string;
};

const AFCHomeBlockIntro = ({ acf }: AFCHomeBlockIntroProps) => {
    return (
        <>
            <div>hi {ReactHtmlParser(acf.test)}</div>
            <div>hi {ReactHtmlParser(acf.testing)}</div>
            <div>hi {ReactHtmlParser(acf.testing_block.url)}</div>
        </>
    );
};

export default AFCHomeBlockIntro;
