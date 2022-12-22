import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import "../styles/globals.css";
import { darkTheme, GlobalStyles, lightTheme } from "./theme";

export default function App({ Component, pageProps }) {
	const [theme, setTheme] = useState("light");
	const isDarkTheme = theme === "dark";
	const toggleTheme = () => setTheme(isDarkTheme ? "light" : "dark");

	return (
		<ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
			<GlobalStyles />
			<Component {...pageProps} />
			<button className='toggleButton' onClick={toggleTheme}>
				{isDarkTheme ? (
					<span aria-label='Light mode'>Light</span>
				) : (
					<span aria-label='Dark mode'>Dark</span>
				)}
			</button>
		</ThemeProvider>
	);
}
