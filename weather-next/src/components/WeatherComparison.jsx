"use client";

import { useState } from "react";

const metrics = [
  { label: "Temperature", key: "temp_c", unit: "°C", precision: 0 },
  { label: "Feels like", key: "feelslike_c", unit: "°C", precision: 0 },
  { label: "Humidity", key: "humidity", unit: "%", precision: 0 },
  { label: "Wind", key: "wind_kph", unit: " km/h", precision: 0 },
  { label: "UV index", key: "uv", unit: "", precision: 1 },
];

export default function WeatherComparison() {
  const [cities, setCities] = useState(["", ""]);
  const [places, setPlaces] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter two cities to compare their current conditions.");

  function updateCity(index, value) {
    setCities((current) => current.map((city, i) => i === index ? value : city));
    setPlaces([null, null]);
    setMessage("Update both cities and compare again to refresh the results.");
  }

  function swapCities() {
    setCities(([first, second]) => [second, first]);
    setPlaces([null, null]);
    setMessage("Cities swapped. Compare to load their current conditions.");
  }

  async function compare(event) {
    event.preventDefault();
    const names = cities.map((city) => city.trim());
    if (names.some((name) => !name)) {
      setMessage("Enter both city names to compare the weather.");
      return;
    }
    if (names[0].toLocaleLowerCase() === names[1].toLocaleLowerCase()) {
      setMessage("Choose two different cities to compare.");
      return;
    }

    setLoading(true);
    setMessage("Loading both cities...");
    setPlaces([null, null]);
    try {
      const results = await Promise.all(names.map(async (city) => {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Couldn't load ${city}.`);
        return data;
      }));
      setPlaces(results);
      setMessage("Showing the latest available conditions for both locations.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card comparison-section" aria-labelledby="comparison-title">
      <div className="pinned-heading">
        <div>
          <p className="section-eyebrow">SIDE BY SIDE</p>
          <h2 id="comparison-title">Compare two cities</h2>
        </div>
      </div>
      <form className="comparison-form" onSubmit={compare}>
        <label className="comparison-field">
          <span>City 1</span>
          <input
            value={cities[0]}
            onChange={(event) => updateCity(0, event.target.value)}
            placeholder="e.g. Karachi"
            aria-label="First city to compare"
            required
          />
        </label>
        <button className="swap-cities" type="button" onClick={swapCities} aria-label="Swap cities" title="Swap cities">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h13m0 0-3-3m3 3-3 3M17 17H4m0 0 3 3m-3-3 3-3" /></svg>
        </button>
        <label className="comparison-field">
          <span>City 2</span>
          <input
            value={cities[1]}
            onChange={(event) => updateCity(1, event.target.value)}
            placeholder="e.g. London"
            aria-label="Second city to compare"
            required
          />
        </label>
        <button className="compare-button" type="submit" disabled={loading}>
          {loading ? "Comparing..." : "Compare weather"}
        </button>
      </form>
      <p className="comparison-message" role="status" aria-live="polite">{message}</p>
      {places.every(Boolean) && (
        <div className="comparison-results">
          {places.map((place, index) => (
            <article className="comparison-city" key={`${place.location.lat}-${place.location.lon}`}>
              <div className="comparison-city-heading">
                <div>
                  <p className="section-eyebrow">CITY {index + 1}</p>
                  <h3>{place.location.name}, {place.location.country}</h3>
                </div>
                <img src={`https:${place.current.condition.icon}`} alt={place.current.condition.text} width="56" height="56" />
              </div>
              <p className="comparison-condition">{place.current.condition.text}</p>
              <dl className="comparison-metrics">
                {metrics.map(({ label, key, unit, precision }) => (
                  <div className="comparison-metric" key={key}>
                    <dt>{label}</dt>
                    <dd>{Number(place.current[key]).toFixed(precision)}{unit}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
          <p className="comparison-note">
            {metrics.map(({ label, key, unit, precision }) => {
              const delta = places[0].current[key] - places[1].current[key];
              const rounded = Number(Math.abs(delta).toFixed(precision));
              const lead = delta === 0 ? "Both cities have the same" : `${delta > 0 ? places[0].location.name : places[1].location.name} is higher by`;
              return `${lead} ${label.toLowerCase()}${delta === 0 ? "" : ` (${rounded}${unit})`}`;
            }).join(" · ")}
          </p>
        </div>
      )}
    </section>
  );
}
