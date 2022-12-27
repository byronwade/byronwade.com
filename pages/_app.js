import {ThemeProvider, BaseStyles} from '@primer/react'
import {themeGet} from '@primer/react'
import styled from 'styled-components'

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
