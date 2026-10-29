
"use client";

import { useEffect, useState } from "react";
import { searchPakistanPlaces } from "@/features/weather/data/pakistanPlaces";

export function useCitySuggestions(query, enabled) {
  const [result, setResult] = useState({
    query: "",
    suggestions: [],
    loading: false,
    error: "",
  });

  const normalizedQuery = query.trim();

  const localSuggestions = searchPakistanPlaces(normalizedQuery);

  const currentResult =
    result.query === normalizedQuery
      ? result
      : { suggestions: [], loading: false, error: "" };

  const seenPlaces = new Set(
    localSuggestions.map((place) => place.name.toLocaleLowerCase())
  );

  const suggestions = [
    ...localSuggestions,
    ...currentResult.suggestions.filter((place) => {
      const key = place.name.toLocaleLowerCase();

      if (seenPlaces.has(key)) {
        return false;
      }

      seenPlaces.add(key);
      return true;
    }),
  ];

  useEffect(() => {
    if (!enabled || !normalizedQuery) {
      return;
    }

    let active = true;

    const timeoutId = setTimeout(async () => {
      if (!active) {
        return;
      }

      setResult({
        query: normalizedQuery,
        suggestions: [],
        loading: true,
        error: "",
      });

      try {
        const response = await fetch(
          `/api/weather/search?q=${encodeURIComponent(normalizedQuery)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Location search failed."
          );
        }

        if (!active) {
          return;
        }

        setResult({
          query: normalizedQuery,
          suggestions: Array.isArray(data) ? data : [],
          loading: false,
          error: "",
        });
      } catch (error) {
        if (
          !active || error.name === "AbortError"
        ) {
          return;
        }

        setResult({
          query: normalizedQuery,
          suggestions: [],
          loading: false,
          error:
            error.message ||
            "Location suggestions are unavailable.",
        });
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [enabled, normalizedQuery]);

  return {
    suggestions,
    loading: currentResult.loading,
    error: currentResult.error,
    isFeatured: !normalizedQuery,
  };
}
