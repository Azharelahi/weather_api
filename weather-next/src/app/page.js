
"use client";

import { useEffect, useState } from "react";

import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import WeatherDetails from "@/components/WeatherDetails";

export default function Home() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [pinnedLocations, setPinnedLocations] = useState([]);
  const [pinsLoaded, setPinsLoaded] = useState(false);

  const [status, setStatus] = useState(
    "Detecting your location..."
  );

  const [loading, setLoading] = useState(true);

  // Load saved locations before allowing any writes to localStorage.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pinnedLocations");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setPinnedLocations(parsed);
        }
      }
    } catch (error) {
      console.error("Could not load pinned locations:", error);
    } finally {
      setPinsLoaded(true);
    }
  }, []);

  // Persist changes only after the initial load has completed.
  useEffect(() => {
    if (!pinsLoaded) return;

    try {
      localStorage.setItem(
        "pinnedLocations",
        JSON.stringify(pinnedLocations)
      );
    } catch (error) {
      console.error("Could not save pinned locations:", error);
    }
  }, [pinnedLocations, pinsLoaded]);

  async function loadWeatherByCoordinates(latitude, longitude) {
    setLoading(true);
    setStatus("Getting your current weather...");

    try {
      const response = await fetch(
        `/api/weather?lat=${latitude}&lon=${longitude}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Weather request failed.");
      }

      setLocation(data.location);
      setWeather(data.current);
      setCity(data.location.name);

      setStatus(`Last updated: ${data.current.last_updated}`);
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
        throw new Error(data.error || "Weather request failed.");
      }

      setLocation(data.location);
      setWeather(data.current);
      setCity(data.location.name);

      setStatus(`Last updated: ${data.current.last_updated}`);
    } catch (error) {
      setWeather(null);
      setLocation(null);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function togglePin() {
    if (!location) return;

    const alreadyPinned = pinnedLocations.some(
      (item) =>
        item.name.toLowerCase() === location.name.toLowerCase() &&
        item.country.toLowerCase() === location.country.toLowerCase()
    );

    if (alreadyPinned) {
      setPinnedLocations((previous) =>
        previous.filter(
          (item) =>
            !(
              item.name.toLowerCase() === location.name.toLowerCase() &&
              item.country.toLowerCase() === location.country.toLowerCase()
            )
        )
      );
    } else {
      setPinnedLocations((previous) => [
        ...previous,
        {
          name: location.name,
          country: location.country,
        },
      ]);
    }
  }

  async function loadPinnedCity(pinnedCity) {
    setCity(pinnedCity.name);
    setLoading(true);
    setStatus(`Loading weather for ${pinnedCity.name}...`);

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(pinnedCity.name)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Weather request failed.");
      }

      setLocation(data.location);
      setWeather(data.current);
      setCity(data.location.name);

      setStatus(`Last updated: ${data.current.last_updated}`);
    } catch (error) {
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
  }, []);

  const isPinned = location
    ? pinnedLocations.some(
        (item) =>
          item.name.toLowerCase() === location.name.toLowerCase() &&
          item.country.toLowerCase() === location.country.toLowerCase()
      )
    : false;

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

        <p className="status" role="status" aria-live="polite">
          {status}
        </p>

        <WeatherDisplay weather={weather} />
        <WeatherDetails weather={weather} />

        <div className="actions">
          <button
            type="button"
            onClick={togglePin}
            disabled={!location || loading || !pinsLoaded}
          >
            {isPinned ? "📌 Unpin Location" : "📍 Pin Location"}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!navigator.geolocation) {
                setStatus(
                  "Location is not supported by this browser."
                );
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
            }}
            disabled={loading}
          >
            {loading ? "Getting Weather..." : "Use My Location"}
          </button>
        </div>
      </section>

      <section className="card pinned-section">
        <h2>📌 Pinned Locations</h2>

        {!pinsLoaded ? (
          <p>Loading pinned locations...</p>
        ) : pinnedLocations.length === 0 ? (
          <p>
            No pinned locations yet. Search for a city and pin it here.
          </p>
        ) : (
          <ul className="pinned-list">
            {pinnedLocations.map((pinnedCity) => (
              <li
                key={`${pinnedCity.name}-${pinnedCity.country}`}
                className="pinned-item"
              >
                <button
                  type="button"
                  onClick={() => loadPinnedCity(pinnedCity)}
                  disabled={loading}
                >
                  {pinnedCity.name}, {pinnedCity.country}
                </button>

                <button
                  type="button"
                  aria-label={`Unpin ${pinnedCity.name}`}
                  onClick={() =>
                    setPinnedLocations((previous) =>
                      previous.filter(
                        (item) =>
                          !(
                            item.name.toLowerCase() ===
                              pinnedCity.name.toLowerCase() &&
                            item.country.toLowerCase() ===
                              pinnedCity.country.toLowerCase()
                          )
                      )
                    )
                  }
                  disabled={!pinsLoaded}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
