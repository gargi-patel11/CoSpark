import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
// 1️⃣ Create Context object
export const ThemeContext = createContext();

// 2️⃣ Export a Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(()=>{
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "cupcake";
  }); // default

   useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3️⃣ Export a custom hook for easy access
export function useTheme() {
  return useContext(ThemeContext);
}
