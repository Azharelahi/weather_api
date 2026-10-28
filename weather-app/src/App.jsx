
import "./styles/WeatherApp.css";

function App() {
  return (
    <main className="container">
      <h1>Weather App</h1>
      <p className="subtitle">
        Check current weather for any city
      </p>

      <section className="card">
        <form className="search">
          <input
            type="text"
            placeholder="Enter a city, e.g. Abbottabad"
            defaultValue="Abbottabad"
          />

          <button type="submit">Get Weather</button>
        </form>

        <h2 className="city">Abbottabad</h2>
        <p className="status">Ready to check the weather.</p>

        <section className="weather">
          <p className="temperature">--°C</p>
          <p className="condition">Weather condition will appear here</p>
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
          <button type="button">Refresh Weather</button>
        </div>
      </section>
    </main>
  );
}

export default App;
