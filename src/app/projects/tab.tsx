"use client";
import React, { useState, useEffect } from "react";
import ForFun from "./ForFun";
import MainProjects from "./MainProjects";

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
					Projects
				</a>
				<a
					onClick={() => setActiveTab(0)}
					className={`tab no-underline ${
						activeTab === 0
							? "tab-active !bg-yellow-500 !text-black"
							: ""
					}`}
				>
					For Fun
				</a>
			</div>
			{activeTab === 0 && <ForFun />}
			{activeTab === 1 && <MainProjects />}
		</div>
	);
};

export default TabMenu;
