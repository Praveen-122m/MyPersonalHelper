import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create the provider component
export const ThemeProvider = ({ children }) => {
    // State to hold the current theme ('light' or 'dark')
    // Initialize from localStorage or default to 'dark'
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme ? storedTheme : 'dark'; // Default to dark as per your preference
    });

    // Effect to update the 'theme' class on the document body/html element
    useEffect(() => {
        const root = window.document.documentElement; // Or window.document.body if you prefer

        // Remove existing theme classes
        root.classList.remove('light', 'dark');

        // Add the current theme class
        root.classList.add(theme);

        // Store the preference in localStorage
        localStorage.setItem('theme', theme);
    }, [theme]); // Rerun effect whenever 'theme' state changes

    // Function to toggle the theme
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to easily use the theme context
export const useTheme = () => {
    return useContext(ThemeContext);
};