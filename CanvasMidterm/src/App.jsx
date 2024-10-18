import { ThemeProvider as StyledThemeProvider } from "styled-components";
import Router from "./components/layout/Router";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const ThemedApp = () => {
   const { theme } = useTheme();

   return (
      <StyledThemeProvider theme={theme}>
         <div className="app">
            <Router />
         </div>
      </StyledThemeProvider>
   );
};

function App() {
   return (
      <AuthProvider>
         <ThemeProvider>
            <ThemedApp />
         </ThemeProvider>
      </AuthProvider>
   );
}

export default App;
