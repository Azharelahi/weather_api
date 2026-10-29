"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "weather-app-theme";
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerTheme() {
  return "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";

    document.documentElement.dataset.theme = nextTheme;
    listeners.forEach((listener) => listener());

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (error) {
      console.error("Could not save theme preference:", error);
    }
  }

  return { theme, toggleTheme };
}
