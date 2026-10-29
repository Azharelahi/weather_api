
"use client";

import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import WeatherDetails from "@/components/WeatherDetails";

import { useWeather } from "@/features/weather/hooks/useWeather";
import { usePinnedLocations } from "@/features/pinned-locations/hooks/usePinnedLocations";
import PinnedLocations from "@/features/pinned-locations/components/PinnedLocations";
import ThemeToggle from "@/features/theme/components/ThemeToggle";
import WeatherComparison from "@/components/WeatherComparison";

export default function Home() {
 const {
  city,
  setCity,
  location,
  weather,
  status,
  loading,
  loadWeatherByCity,
  loadWeatherForCity,
  useMyLocation,
} = useWeather();

  const {
    pinnedLocations,
    pinsLoaded,
    togglePin,
    removePin,
    isPinned,
  } = usePinnedLocations();

  return (
    <main className="container">
      <header className="page-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M10 21.5h12a5.5 5.5 0 0 0 .4-11 7 7 0 0 0-13.2 1.8A4.6 4.6 0 0 0 10 21.5Z" />
              <path d="m12 25-1 2m7-2-1 2m7-2-1 2" />
            </svg>
          </span>
          <span>Atmos</span>
        </div>
        <ThemeToggle />
        <div className="page-intro">
          <p className="eyebrow">YOUR LITTLE CORNER OF THE SKY</p>
          <h1>Weather, made <span>clear.</span></h1>
          <p className="subtitle">A fresh look at the day, wherever you are.</p>
        </div>
      </header>

      <section className="card">
        <SearchBar
          city={city}
          onCityChange={setCity}
          onSearch={loadWeatherByCity}
          onCitySelect={loadWeatherForCity}
          loading={loading}
        />

        <div className="weather-heading">
          <div>
            <p className="section-eyebrow">CURRENT CONDITIONS</p>
            <h2 className="city">
              {location
                ? `${location.name}, ${location.country}`
                : "Your weather"}
            </h2>
          </div>
          <span className="live-indicator">
            <span aria-hidden="true" />
            LIVE
          </span>
        </div>

        <p className="status" role="status" aria-live="polite">
          {status}
        </p>

        <WeatherDisplay weather={weather} />
        <WeatherDetails weather={weather} />

        <div className="actions">
          <button
            className="action-button action-button-secondary"
            type="button"
            onClick={() => togglePin(location)}
            disabled={!location || loading || !pinsLoaded}
          >
            {isPinned(location)
              ? "📌 Unpin Location"
              : "📍 Pin Location"}
          </button>

          <button
            className="action-button action-button-primary"
            type="button"
            onClick={useMyLocation}
            disabled={loading}
          >
            {loading ? "Getting Weather..." : "Use My Location"}
          </button>
        </div>
      </section>

      <WeatherComparison />

      {!pinsLoaded ? (
        <section className="card pinned-section">
          <div className="pinned-heading">
            <div>
              <p className="section-eyebrow">YOUR SAVED PLACES</p>
              <h2>Pinned locations</h2>
            </div>
          </div>
          <p className="pinned-loading">Loading your saved places...</p>
        </section>
      ) : (
        <PinnedLocations
          locations={pinnedLocations}
          currentLocation={location}
          onSelect={loadWeatherForCity}
          onRemove={removePin}
          loading={loading}
        />
      )}
    </main>
  );
}
