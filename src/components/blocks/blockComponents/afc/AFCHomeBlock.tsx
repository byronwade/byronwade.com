import React from "react";
import ReactHtmlParser from "react-html-parser";
import Img from "gatsby-image" //gatsby image API
import Link from "../../../utils/links"; //custom links

type AFCHomeBlockHomeProps = {
	acf: {
		name: Object
		logo: Object
		first_button: Object
		second_button: Object
		tagline: String
		what_i_do: String
		where_i_am_from: String
	}
};

const AFCHomeBlockIntro = (props: AFCHomeBlockHomeProps) => {
    return (
        <>
            <Img className="home_page_logo" fluid={props.acf.logo.imageFile.childImageSharp.fluid} alt="Gatsby Docs are awesome" />
			<h1>{ReactHtmlParser(props.acf.name)}</h1>
			<div>{ReactHtmlParser(props.acf.tagline)}</div>
			<div>{ReactHtmlParser(props.acf.what_i_do)}</div>
			<div>{ReactHtmlParser(props.acf.where_i_am_from)}</div>
			<Link to={props.acf.first_button.url}>{props.acf.first_button.title}</Link>
			<Link to={props.acf.second_button.url}>{props.acf.second_button.title}</Link>
        </>
    );
};

export default AFCHomeBlockIntro;
