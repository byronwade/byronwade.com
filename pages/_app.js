import { useLayoutEffect } from 'react';
import {ThemeProvider, BaseStyles} from '@primer/react'
import {themeGet} from '@primer/react'
import styled from 'styled-components'

//to suppress all the warings from useLayoutEffect
if (typeof window === "undefined") useLayoutEffect = () => {};

const Background = styled.div`
  background-color: ${themeGet('colors.canvas.default')};
  height: 100vh;
  width:100%;
`

export default function App({ Component, pageProps }) {
	return (
		<ThemeProvider colorMode="auto" preventSSRMismatch>
			<BaseStyles>
				<Background>
					<Component {...pageProps} />
				</Background>
			</BaseStyles>
		</ThemeProvider>
	);
}
