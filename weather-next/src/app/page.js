
"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import WeatherDetails from "@/components/WeatherDetails";

export default function Home() {
  const [city, setCity] = useState("Abbottabad");
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("Search for a city to get started.");
  const [loading, setLoading] = useState(false);

  async function loadWeather(event) {
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
        throw new Error(data.error || "Weather request failed.");
      }

      setLocation(data.location);
      setWeather(data.current);
      setStatus(`Last updated: ${data.current.last_updated}`);
    } catch (error) {
      setWeather(null);
      setLocation(null);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Weather App</h1>
        <p className="subtitle">
          Current weather, wherever you are.
        </p>
      </header>

      <section className="card">
        <SearchBar
          city={city}
          onCityChange={setCity}
          onSearch={loadWeather}
          loading={loading}
        />

        <h2 className="city">
          {location
            ? `${location.name}, ${location.country}`
            : "Current Weather"}
        </h2>

        <p className="status" role="status" aria-live="polite">
          {status}
        </p>

        <WeatherDisplay weather={weather} />
        <WeatherDetails weather={weather} />

        <div className="actions">
          <button
            type="button"
            onClick={() => loadWeather()}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Weather"}
          </button>
        </div>
      </section>
    </main>
  );
}
