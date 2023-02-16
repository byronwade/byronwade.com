"use client";
import React, { useState } from "react";
import GetDribble from "./getDribbbles";
import GetRepo from "./getRepo";

const TabMenu = () => {
	const [activeTab, setActiveTab] = useState(1);

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
					Dribble
				</a>
				<a
					onClick={() => setActiveTab(0)}
					className={`tab no-underline ${
						activeTab === 0
							? "tab-active !bg-yellow-500 !text-black"
							: ""
					}`}
				>
					Github
				</a>
			</div>
			{activeTab === 1 && <GetDribble />}
			{activeTab === 0 && <GetRepo />}
		</div>
	);
};

export default TabMenu;
