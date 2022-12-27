import { useState, useLayoutEffect } from 'react';
import { Button, Spinner, useTheme } from '@primer/react';

const DarkMode = () => {
const [colorMode, setColorMode] = useState();
const { setColorMode: setColorModeTheme } = useTheme();
const [loading, setLoading] = useState(false);

useLayoutEffect(() => {
    const storedColorMode = localStorage.getItem('colorMode');
    if (storedColorMode) {
      setColorMode(storedColorMode);
      setColorModeTheme(storedColorMode);
    }
  }, [colorMode, setColorMode, setColorModeTheme]);
  
  const toggleColorMode = async () => {
    setLoading(true);
    const newColorMode = colorMode === 'light' ? 'dark' : 'light';
    setColorModeTheme(newColorMode);
    setColorMode(newColorMode);
    localStorage.setItem('colorMode', newColorMode);
    setLoading(false);
  };
  
  return (
    <Button onClick={toggleColorMode}>
      {loading ? <Spinner size={24} /> : colorMode === 'light' ? 'Light' : 'Dark'}
    </Button>
  );
};

export default DarkMode;