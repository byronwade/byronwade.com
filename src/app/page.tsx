import Image from "next/image";

export default function Home() {
	return (
		<main className="min-w-0 mt-6 flex flex-col mb-40">
			<section className="mx-auto">
				<h1 className="font-bold text-5xl">Byron Wade</h1>
				<p className="my-5 max-w-[460px]">
					Hello, I&apos;m Byron, the <b>CEO and Co-Owner of Wade&apos;s Inc</b>. As an entrepreneur, I always seek new opportunities to expand my company and create innovative solutions. I&apos;m excited to share my story and vision with you.
				</p>
				<div className="flex items-start md:items-center my-8 flex-col md:flex-row">
					<div className="avatar">
						<div className="w-24 rounded-full ring ring-warning ring-offset-base-100 ring-offset-2">
							<Image alt="Byron Wade" src="/avatar.avif" width={100} height={100} className="rounded-full grayscale" />
						</div>
					</div>
					<div className="mt-8 md:mt-0 ml-0 md:ml-6 space-y-2 text-muted-foreground">
						<p className="flex items-center gap-2">
							<svg width={20} height={16} viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<g clipPath="url(#a)">
									<path
										d="M21.479 4.937c.015.209.015.418.015.628 0 6.424-4.917 13.832-13.906 13.832v-.004a13.89 13.89 0 0 1-7.491-2.18 9.847 9.847 0 0 0 7.233-2.015 4.89 4.89 0 0 1-4.566-3.375c.732.14 1.487.112 2.206-.084a4.868 4.868 0 0 1-3.92-4.764v-.062c.68.376 1.44.585 2.218.608a4.851 4.851 0 0 1-1.513-6.49 13.896 13.896 0 0 0 10.073 5.078 4.848 4.848 0 0 1 1.414-4.644 4.911 4.911 0 0 1 6.914.21A9.84 9.84 0 0 0 23.26.496a4.884 4.884 0 0 1-2.149 2.69 9.76 9.76 0 0 0 2.807-.766 9.898 9.898 0 0 1-2.439 2.518Z"
										fill="currentColor"
									/>
								</g>
								<defs>
									<clipPath id="a">
										<path fill="#fff" d="M0 0h24v19.636H0z" />
									</clipPath>
								</defs>
							</svg>
							54 tweets all time
						</p>
						<p className="flex items-center gap-2">
							<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<g clipPath="url(#clip0_9914_10)">
									<path
										d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z"
										fill="currentColor"
									/>
								</g>
								<defs>
									<clipPath id="clip0_9914_10">
										<rect width={24} height={24} fill="white" />
									</clipPath>
								</defs>
							</svg>
							13 stars all time
						</p>
						<p className="flex items-center">
							<svg className="mr-2" width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.25 18.0001L9 11.2501L13.306 15.5571C14.5507 13.1029 16.6044 11.1535 19.12 10.0381L21.86 8.81809M21.86 8.81809L15.92 6.53809M21.86 8.81809L19.58 14.7591" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							658 blog views all time
						</p>
					</div>
				</div>
				<div />
				<div className="mb-[10em] max-w-[460px] prose prose-neutral dark:prose-invert">
					<p>
						<b>Wade&apos;s Inc.</b> comprises two companies: <a href="https://wadesplumbingandseptic.com/">Wade&apos;s Plumbing and Septic</a> and <a href="https://clogmonsterssepticpumping.com/">Clog Monsters Septic Pumping</a>. In our first year, Wade&apos;s Plumbing and Septic generated an impressive revenue of <b className="text-green-700">$1.2 million</b>, and we&apos;re projected to reach <b className="text-green-700">$2.3 million</b> next year with ten employees.
					</p>
					<p>I&apos;m studying Computer Science at Cabrillo College and plan to transfer to San Jose State to acquire my degree. Additionally, I&apos;m considering pursuing degrees in Civil Engineering, Aerospace Engineering, and Criminal Justice to broaden my knowledge and expertise further.</p>
					<p>
						I&apos;m always open to collaborations and new opportunities to contribute to website technology projects. I&apos;m currently working on three innovative technology websites, including
						<a href="https://github.com/byronwade/wadesacademy.com"> Wade&apos;s Academy</a>, which has the potential to revolutionize online learning in the construction industry.
					</p>
					<p className="mb-8">
						I&apos;m a driven and passionate entrepreneur, continuously seeking new and innovative ways to expand my company and revolutionize the industry. I&apos;m open to exploring collaboration and investment opportunities and would be honored to hear from you. Please don&apos;t hesitate to <a href="/contact">reach out </a>if you&apos;d like to learn more about me and my vision.
					</p>
					<div className="flex flex-col gap-2 md:flex-row md:gap-2">
						<a rel="noopener noreferrer" target="_blank" href="https://twitter.com/leeerob" className="flex w-full border border-input rounded-lg p-4 no-underline items-center transition-all justify-between">
							<div className="flex items-center">
								<svg width={20} height={16} viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g clipPath="url(#a)">
										<path
											d="M21.479 4.937c.015.209.015.418.015.628 0 6.424-4.917 13.832-13.906 13.832v-.004a13.89 13.89 0 0 1-7.491-2.18 9.847 9.847 0 0 0 7.233-2.015 4.89 4.89 0 0 1-4.566-3.375c.732.14 1.487.112 2.206-.084a4.868 4.868 0 0 1-3.92-4.764v-.062c.68.376 1.44.585 2.218.608a4.851 4.851 0 0 1-1.513-6.49 13.896 13.896 0 0 0 10.073 5.078 4.848 4.848 0 0 1 1.414-4.644 4.911 4.911 0 0 1 6.914.21A9.84 9.84 0 0 0 23.26.496a4.884 4.884 0 0 1-2.149 2.69 9.76 9.76 0 0 0 2.807-.766 9.898 9.898 0 0 1-2.439 2.518Z"
											fill="currentColor"
										/>
									</g>
									<defs>
										<clipPath id="a">
											<path fill="#fff" d="M0 0h24v19.636H0z" />
										</clipPath>
									</defs>
								</svg>
								<div className="ml-3">Twitter</div>
							</div>
							<svg className="mr-2" width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z" fill="currentColor" />
							</svg>
						</a>
						<a rel="noopener noreferrer" target="_blank" href="https://github.com/leerob" className="flex w-full border border-input rounded-lg p-4 no-underline items-center transition-all justify-between">
							<div className="flex items-center">
								<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g clipPath="url(#clip0_9914_10)">
										<path
											d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z"
											fill="currentColor"
										/>
									</g>
									<defs>
										<clipPath id="clip0_9914_10">
											<rect width={24} height={24} fill="white" />
										</clipPath>
									</defs>
								</svg>
								<div className="ml-3">GitHub</div>
							</div>
							<svg className="mr-2" width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z" fill="currentColor" />
							</svg>
						</a>
						<a rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/@leerob" className="flex w-full border border-input rounded-lg p-4 no-underline items-center transition-all justify-between">
							<div className="flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" height={800} width={800} viewBox="0 0 461.001 461.001" className="w-5 h-5" fill="currentColor">
									<path d="M365.257 67.393H95.744C42.866 67.393 0 110.259 0 163.137v134.728c0 52.878 42.866 95.744 95.744 95.744h269.513c52.878 0 95.744-42.866 95.744-95.744V163.137c0-52.878-42.866-95.744-95.744-95.744zm-64.751 169.663-126.06 60.123c-3.359 1.602-7.239-.847-7.239-4.568V168.607c0-3.774 3.982-6.22 7.348-4.514l126.06 63.881c3.748 1.899 3.683 7.274-.109 9.082z" />
								</svg>
								<div className="ml-3">YouTube</div>
							</div>
							<svg className="mr-2" width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z" fill="currentColor" />
							</svg>
						</a>
					</div>
				</div>
			</section>
		</main>
	);
}
