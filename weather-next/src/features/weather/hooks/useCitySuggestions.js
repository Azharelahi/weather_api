
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
//azhar
  const normalizedQuery = query.trim();

  const localSuggestions = searchPakistanPlaces(normalizedQuery);

  const currentResult =
    result.query === normalizedQuery
      ? result
      : { suggestions: [], loading: false, error: "" };

  const liveSuggestionsByName = new Map(
    currentResult.suggestions.map((place) => [
      place.name.toLocaleLowerCase(),
      place,
    ])
  );
  const seenPlaces = new Set();
  const suggestions = [];

  for (const localPlace of localSuggestions) {
    const key = localPlace.name.toLocaleLowerCase();
    const livePlace = liveSuggestionsByName.get(key);
    seenPlaces.add(key);
    suggestions.push(livePlace ? { ...localPlace, ...livePlace } : localPlace);
  }

  for (const livePlace of currentResult.suggestions) {
    const key = livePlace.name.toLocaleLowerCase();

    if (!seenPlaces.has(key)) {
      seenPlaces.add(key);
      suggestions.push(livePlace);
    }
  }

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
          `/api/weather/search?q=${encodeURIComponent(normalizedQuery)}`,
          { cache: "no-store" }
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
