import { useState, useLayoutEffect } from 'react';
import { Button, Spinner, useTheme } from '@primer/react';
import styled from 'styled-components'

const DarkMode = () => {
const [colorMode, setColorMode] = useState("");
const { setColorMode: setColorModeTheme } = useTheme();
const [loading, setLoading] = useState(false);

useLayoutEffect(() => {
  const storedColorMode = localStorage.getItem('colorMode');
  if (storedColorMode) {
    setColorMode(storedColorMode);
    setColorModeTheme(storedColorMode);
  } else {
    // Set the color mode to light or dark based on user preference
    const userPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setColorMode(userPreference);
    setColorModeTheme(colorMode || "auto");
    localStorage.setItem('colorMode', userPreference);
  }
  // Monitor changes to the user's preference for color mode
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleMediaQueryChange = (e) => {
    const newColorMode = e.matches ? "dark" : "light";
    setColorMode(newColorMode);
    setColorModeTheme(newColorMode);
    localStorage.setItem('colorMode', newColorMode);
  };
  mediaQuery.addEventListener("change", handleMediaQueryChange);
  return () => {
    mediaQuery.removeEventListener("change", handleMediaQueryChange);
  };
}, [colorMode, setColorMode, setColorModeTheme]);
  
  const toggleColorMode = async () => {
    setLoading(true);
    let newColorMode;
    if (colorMode === "auto") {
      // Do not change the color mode if it is set to "auto"
      newColorMode = colorMode;
    } else {
      newColorMode = colorMode === "light" ? "dark" : "light";
    }
    setColorModeTheme(newColorMode);
    setColorMode(newColorMode);
    localStorage.setItem('colorMode', newColorMode);
    setLoading(false);
  };

  const DarkButton = styled(Button)`
    display: inline-block;
  `
  
  return (
    <DarkButton className="darkMode" onClick={toggleColorMode}>
      {loading ? <Spinner size={24} /> : colorMode === 'light' ? 'Dark' : 'Light'}
    </DarkButton>
  );
};

export default DarkMode;