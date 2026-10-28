
import { useState } from "react";
import "./styles/WeatherApp.css";
import SearchBar from "./components/SearchBar";
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

        <section className="weather">
          <p className="temperature">--°C</p>
          <p className="condition">
            Weather condition will appear here
          </p>
        </section>

        <div className="details">
          <div className="detail">
            <strong>Feels Like</strong>
            <span>--°C</span>
          </div>
          <div className="detail">
            <strong>Humidity</strong>
            <span>--%</span>
          </div>
          <div className="detail">
            <strong>Wind</strong>
            <span>-- km/h</span>
          </div>
          <div className="detail">
            <strong>Cloud Cover</strong>
            <span>--%</span>
          </div>
          <div className="detail">
            <strong>Pressure</strong>
            <span>-- mb</span>
          </div>
          <div className="detail">
            <strong>UV Index</strong>
            <span>--</span>
          </div>
        </div>

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
