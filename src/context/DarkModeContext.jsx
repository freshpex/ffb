import { createContext, useState, useEffect, useContext } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const getInitialMode = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedMode = window.localStorage.getItem('darkMode');
      if (typeof savedMode === 'string') {
        return savedMode === 'true';
      }
      
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return true;
      }
    }
    
    return true;
  };

  const [darkMode, setDarkMode] = useState(getInitialMode);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Update the class on the html element and localStorage when darkMode changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use the dark mode context
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};
