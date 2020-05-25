import React from "react";
import LazyLoad from "react-lazyload";
import { YouTubeGetID } from "../../utils/helpers";

type YouTubeProps = {
	attributes: {
		className?: string;
		url?: string;
	};
	className?: string;
	url?: string;
};

const YouTube = ({ className, url }: YouTubeProps) => {
	if (url) {
		return (
			<LazyLoad
				placeholder={
					<img
						src='https://via.placeholder.com/560x315'
						alt='Image Place Holder'
					/>
				}>
				<iframe
					width='560'
					height='315'
					className={className}
					src={`//www.youtube.com/embed/` + YouTubeGetID(url)}
					frameBorder='0'
					allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen></iframe>
			</LazyLoad>
		);
	}
	return null;
};

export default YouTube;
