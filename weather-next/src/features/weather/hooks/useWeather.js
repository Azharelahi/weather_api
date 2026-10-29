
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
    async (
      url,
      loadingMessage,
      clearOnError = false,
      preferredCityName = ""
    ) => {
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

        const weatherLocation = preferredCityName
          ? { ...data.location, name: preferredCityName }
          : data.location;

        setLocation(weatherLocation);
        setWeather(data.current);
        setCity(weatherLocation.name);

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
    async (place) => {
      const cityName = typeof place === "string" ? place : place.name;
      setCity(cityName);

      if (
        typeof place !== "string" &&
        Number.isFinite(place.latitude) &&
        Number.isFinite(place.longitude)
      ) {
        return fetchWeather(
          `/api/weather?lat=${place.latitude}&lon=${place.longitude}`,
          `Loading weather for ${cityName}...`,
          true,
          cityName
        );
      }

      const query =
        typeof place === "string"
          ? cityName
          : [place.name, place.region, place.country]
              .filter(Boolean)
              .join(", ");

      setLoading(true);
      setStatus(`Finding ${cityName}...`);

      try {
        const response = await fetch(
          `/api/weather/search?q=${encodeURIComponent(query)}`,
          { cache: "no-store" }
        );
        const locations = await response.json();

        if (!response.ok) {
          throw new Error(locations.error || "Location search failed.");
        }

        const normalizedCityName = cityName.toLocaleLowerCase();
        const resolvedPlace =
          locations.find(
            (location) =>
              location.name.toLocaleLowerCase() === normalizedCityName &&
              (typeof place === "string" ||
                !place.countryCode ||
                location.countryCode === place.countryCode)
          ) || locations[0];

        if (!resolvedPlace) {
          throw new Error(`Could not find ${cityName}.`);
        }

        return await fetchWeather(
          `/api/weather?lat=${resolvedPlace.latitude}&lon=${resolvedPlace.longitude}`,
          `Loading weather for ${cityName}...`,
          true,
          cityName
        );
      } catch (error) {
        setLocation(null);
        setWeather(null);
        setStatus(`Error: ${error.message}`);
        setLoading(false);
        return null;
      }
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
