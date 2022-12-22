//import React, { useState } from 'react';

import Footer from "./components/pageComponents/footer";
import Header from "./components/pageComponents/header";
import Nav from "./components/pageComponents/nav";

export default function Playground() {
	return (
		<>
			<Header />
			<Nav />
			<div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>Playground</div>
			<Footer />
		</>
	);
}
