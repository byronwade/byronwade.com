import React from "react";
import ContactForm from "../../../parts/contact"

type ShortCodesProps = {
	originalContent?: string;
};

const ShortCodes = ({ originalContent }: ShortCodesProps) => {
	console.log(originalContent)
	if(originalContent === "[contactForm]") {
		return <ContactForm></ContactForm>
	}
	return <p>asdklf {originalContent}</p>
};

export default ShortCodes;
