import React from "react";
import ContactForm from "../../../parts/contact"

type ShortCodesProps = {
	originalContent?: string;
};

const ShortCodes = ({ originalContent }: ShortCodesProps) => {
	if(originalContent === "[contactForm]") {
		return <ContactForm></ContactForm>
	}
	return <p>{originalContent}</p>
};

export default ShortCodes;
