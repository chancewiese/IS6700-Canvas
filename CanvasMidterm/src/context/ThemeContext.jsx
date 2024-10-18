import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
   const [darkMode, setDarkMode] = useState(false);

   useEffect(() => {
      const isDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(isDarkMode);
   }, []);

   const toggleDarkMode = () => {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      localStorage.setItem("darkMode", newDarkMode);
   };

   const theme = {
      // Used AI to suggest colors for my theme.
      colors: darkMode
         ? {
              primary: "#6b8e23", // Darker sage green for dark mode
              primaryDark: "#556b2f", // Even darker sage green for hover effects in dark mode
              secondary: "#2f4f4f", // Dark slate gray for backgrounds in dark mode
              text: "#f0f8ff", // Alice blue for text in dark mode
              accent: "#98fb98", // Pale green for accents in dark mode
              white: "#ffffff",
              error: "#ff6347", // Tomato for error in dark mode
              delete: "#ff6347", // Tomato for delete in dark mode
              deleteHover: "#8b0000", // Dark red for delete hover in dark mode
              success: "#32cd32", // Lime green for success in dark mode
              background: "#1a1a1a", // Very dark gray for main background in dark mode
           }
         : {
              primary: "#8fbc8f", // Sage green
              primaryDark: "#698b69", // Darker sage green for hover effects
              secondary: "#e9f5db", // Light sage green for backgrounds
              text: "#2c3e50", // Dark blue-grey for text
              accent: "#4a5d23", // Dark green for accents
              white: "#ffffff",
              error: "#e74c3c",
              delete: "#e74c3c",
              deleteHover: "#f9c1bc",
              success: "#2ecc71", // Green for success messages
              background: "#ffffff", // White for main background in light mode
           },
      fonts: {
         main: "'Roboto', sans-serif",
      },
      spacing: {
         small: "8px",
         medium: "16px",
         large: "24px",
      },
      borderRadius: "4px",
   };

   return (
      <ThemeContext.Provider value={{ theme, darkMode, toggleDarkMode }}>
         {children}
      </ThemeContext.Provider>
   );
};

export const useTheme = () => {
   const context = useContext(ThemeContext);
   if (!context) {
      throw new Error("useTheme must be used within a ThemeProvider");
   }
   return context;
};
