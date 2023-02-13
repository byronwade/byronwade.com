"use client";
import React, { useState, useEffect } from "react";
import GetDribble from "./getDribbbles";
import GetRepo from "./getRepo";

const TabMenu = () => {
	const [activeTab, setActiveTab] = useState(0);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === "ArrowRight") {
				setActiveTab((prevActiveTab) => (prevActiveTab + 1) % 3);
			}
			if (event.key === "ArrowLeft") {
				setActiveTab((prevActiveTab) => (prevActiveTab + 2) % 3);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="prose prose-neutral dark:prose-invert text-neutral-800 dark:text-neutral-200">
			<div className="tabs tabs-boxed inline-block">
				<a
					onClick={() => setActiveTab(1)}
					className={`tab no-underline ${
						activeTab === 1
							? "tab-active !bg-yellow-500 !text-black"
							: ""
					}`}
				>
					Github
				</a>
				<a
					onClick={() => setActiveTab(0)}
					className={`tab no-underline ${
						activeTab === 0
							? "tab-active !bg-yellow-500 !text-black"
							: ""
					}`}
				>
					Dribble
				</a>
			</div>
			{activeTab === 0 && <div>dribble</div>}
			{activeTab === 1 && <div>githb</div>}
		</div>
	);
};

export default TabMenu;
