//import React, { useState } from 'react';
import PageContent from "../components/pageContent";
import {Button} from '@primer/react'


export default function Home() {
	return (
		<PageContent>
			<div className='controls'>
				<h1>Home</h1>
			</div>
      <div>
        <Button>Home</Button>
      </div>
		</PageContent>
	);
}
