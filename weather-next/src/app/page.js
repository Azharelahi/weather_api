
"use client";

import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import WeatherDetails from "@/components/WeatherDetails";

import { useWeather } from "@/features/weather/hooks/useWeather";
import { usePinnedLocations } from "@/features/pinned-locations/hooks/usePinnedLocations";
import PinnedLocations from "@/features/pinned-locations/components/PinnedLocations";

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
            : "Weather"}
        </h2>

        <p className="status" role="status" aria-live="polite">
          {status}
        </p>

        <WeatherDisplay weather={weather} />
        <WeatherDetails weather={weather} />

        <div className="actions">
          <button
            type="button"
            onClick={() => togglePin(location)}
            disabled={!location || loading || !pinsLoaded}
          >
            {isPinned(location)
              ? "📌 Unpin Location"
              : "📍 Pin Location"}
          </button>

          <button
            type="button"
            onClick={useMyLocation}
            disabled={loading}
          >
            {loading ? "Getting Weather..." : "Use My Location"}
          </button>
        </div>
      </section>

      {!pinsLoaded ? (
        <section className="card pinned-section">
          <h2>📌 Pinned Locations</h2>
          <p>Loading pinned locations...</p>
        </section>
      ) : (
  
<PinnedLocations
  locations={pinnedLocations}
  onSelect={(location) => loadWeatherForCity(location.name)}
  onRemove={removePin}
  loading={loading}
/>

      )}
    </main>
  );
}
