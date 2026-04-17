"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ModeContext = createContext({
  isDark: false,
  toggleDark: () => {},
});

export const ModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark"); // ✅ force light
      setIsDark(false);
    }
  }, []);

  const toggleDark = () => {
    const isNowDark = !isDark;
    setIsDark(isNowDark);
    if (isNowDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <ModeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
