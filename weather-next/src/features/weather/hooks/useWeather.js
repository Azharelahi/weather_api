
"use client";

import { useCallback, useEffect, useState } from "react";

export function useWeather() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState(
    "Detecting your location..."
  );
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(
    async (url, loadingMessage, clearOnError = false) => {
      setLoading(true);
      setStatus(loadingMessage);

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Weather request failed."
          );
        }

        setLocation(data.location);
        setWeather(data.current);
        setCity(data.location.name);

        setStatus(
          `Last updated: ${data.current.last_updated}`
        );

        return data;
      } catch (error) {
        if (clearOnError) {
          setLocation(null);
          setWeather(null);
        }

        setStatus(`Error: ${error.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadWeatherByCoordinates = useCallback(
    (latitude, longitude) => {
      return fetchWeather(
        `/api/weather?lat=${latitude}&lon=${longitude}`,
        "Getting your current weather..."
      );
    },
    [fetchWeather]
  );

  const loadWeatherByCity = useCallback(
    (event) => {
      event?.preventDefault();

      const cityName = city.trim();

      if (!cityName) {
        setStatus("Please enter a city name.");
        return;
      }

      return fetchWeather(
        `/api/weather?city=${encodeURIComponent(cityName)}`,
        "Loading weather...",
        true
      );
    },
    [city, fetchWeather]
  );

  const loadWeatherForCity = useCallback(
    (cityName) => {
      setCity(cityName);

      return fetchWeather(
        `/api/weather?city=${encodeURIComponent(cityName)}`,
        `Loading weather for ${cityName}...`,
        true
      );
    },
    [fetchWeather]
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus(
        "Location is not supported. Enter a city manually."
      );
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        setStatus(
          "Location unavailable. Enter a city manually."
        );
        setLoading(false);
      }
    );
  }, [loadWeatherByCoordinates]);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setStatus("Location is not supported by this browser.");
      return;
    }

    setLoading(true);
    setStatus("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        setStatus("Could not access your location.");
        setLoading(false);
      }
    );
  }

  return {
    city,
    setCity,
    location,
    weather,
    status,
    loading,
    loadWeatherByCity,
    loadWeatherForCity,
    useMyLocation,
  };
}
