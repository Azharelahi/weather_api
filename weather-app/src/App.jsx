
import { useState } from "react";
import "./styles/WeatherApp.css";
import SearchBar from "./components/SearchBar";
import WeatherDisplay from "./components/WeatherDisplay";
import WeatherDetails from "./components/WeatherDetails";
function App() {
  const [city, setCity] = useState("Abbottabad");
  const [status, setStatus] = useState(
    "Enter a city and click Get Weather."
  );

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setStatus("Please enter a city name.");
      return;
    }

    setCity(trimmedCity);
    setStatus(`Ready to check weather for ${trimmedCity}.`);
  }

  function handleRefresh() {
    setStatus(`Ready to refresh weather for ${city}.`);
  }

  return (
    <main className="container">
      <h1>Weather App</h1>
      <p className="subtitle">
        Check current weather for any city
      </p>

      <section className="card">
       <SearchBar
  city={city}
  onCityChange={setCity}
  onSearch={handleSubmit}
/>

        <h2 className="city">{city || "Choose a city"}</h2>
        <p className="status" role="status">{status}</p>

  <WeatherDisplay
  temperature={null}
  condition=""
  icon=""
/>

       <WeatherDetails weather={null} />

        <div className="actions">
          <button type="button" onClick={handleRefresh}>
            Refresh Weather
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
