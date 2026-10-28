"use client";

import { useEffect, useState } from "react";

import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import WeatherDetails from "@/components/WeatherDetails";

export default function Home() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  const [status, setStatus] = useState(
    "Detecting your location..."
  );

  const [loading, setLoading] = useState(true);

  async function loadWeatherByCoordinates(latitude, longitude) {
    setLoading(true);
    setStatus("Getting your current weather...");

    try {
      const response = await fetch(
        `/api/weather?lat=${latitude}&lon=${longitude}`
      );

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
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function loadWeatherByCity(event) {
    event?.preventDefault();

    const cityName = city.trim();

    if (!cityName) {
      setStatus("Please enter a city name.");
      return;
    }

    setLoading(true);
    setStatus("Loading weather...");

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Weather request failed."
        );
      }

      setLocation(data.location);
      setWeather(data.current);

      setStatus(
        `Last updated: ${data.current.last_updated}`
      );
    } catch (error) {
      setWeather(null);
      setLocation(null);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

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
    console.log("Latitude:", position.coords.latitude);
    console.log("Longitude:", position.coords.longitude);
    console.log("Accuracy:", position.coords.accuracy);

    loadWeatherByCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );
  },
  (error) => {
    console.log("Location error:", error.message);
  }
);
  }, []);

  return (
    <main className="container">

      <header className="page-header">
        <h1>Weather App</h1>

        <p className="subtitle">
          Current weather based on your location
        </p>
      </header>

      <section className="card">

        <SearchBar
          city={city}
          onCityChange={setCity}
          onSearch={loadWeatherByCity}
          loading={loading}
        />

        <h2 className="city">
          {location
            ? `${location.name}, ${location.country}`
            : "Detecting location..."}
        </h2>

        <p
          className="status"
          role="status"
          aria-live="polite"
        >
          {status}
        </p>

        <WeatherDisplay
          weather={weather}
        />

        <WeatherDetails
          weather={weather}
        />

        <div className="actions">

          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    loadWeatherByCoordinates(
                      position.coords.latitude,
                      position.coords.longitude
                    );
                  }
                );
              }
            }}
            disabled={loading}
          >
            {loading
              ? "Getting Weather..."
              : "Use My Location"}
          </button>

        </div>

      </section>

    </main>
  );
}