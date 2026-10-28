
"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pinnedLocations";

export function usePinnedLocations() {
  const [pinnedLocations, setPinnedLocations] = useState([]);
  const [pinsLoaded, setPinsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setPinnedLocations(
            parsed.filter(
              (item) =>
                item &&
                typeof item.name === "string" &&
                typeof item.country === "string"
            )
          );
        }
      }
    } catch (error) {
      console.error("Could not load pinned locations:", error);
    } finally {
      setPinsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!pinsLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(pinnedLocations)
      );
    } catch (error) {
      console.error("Could not save pinned locations:", error);
    }
  }, [pinnedLocations, pinsLoaded]);

  const togglePin = useCallback((location) => {
    if (!location) return;

    setPinnedLocations((previous) => {
      const exists = previous.some(
        (item) =>
          item.name.toLowerCase() ===
            location.name.toLowerCase() &&
          item.country.toLowerCase() ===
            location.country.toLowerCase()
      );

      if (exists) {
        return previous.filter(
          (item) =>
            !(
              item.name.toLowerCase() ===
                location.name.toLowerCase() &&
              item.country.toLowerCase() ===
                location.country.toLowerCase()
            )
        );
      }

      return [
        ...previous,
        {
          name: location.name,
          country: location.country,
        },
      ];
    });
  }, []);

  const removePin = useCallback((location) => {
    setPinnedLocations((previous) =>
      previous.filter(
        (item) =>
          !(
            item.name.toLowerCase() ===
              location.name.toLowerCase() &&
            item.country.toLowerCase() ===
              location.country.toLowerCase()
          )
      )
    );
  }, []);

  const isPinned = useCallback(
    (location) =>
      Boolean(
        location &&
          pinnedLocations.some(
            (item) =>
              item.name.toLowerCase() ===
                location.name.toLowerCase() &&
              item.country.toLowerCase() ===
                location.country.toLowerCase()
          )
      ),
    [pinnedLocations]
  );

  return {
    pinnedLocations,
    pinsLoaded,
    togglePin,
    removePin,
    isPinned,
  };
}
