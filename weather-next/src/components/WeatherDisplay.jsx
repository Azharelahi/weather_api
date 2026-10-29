
export default function WeatherDisplay({ weather }) {
  if (!weather) {
    return (
      <section className="weather weather-empty">
        <span className="weather-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="8" />
            <path d="M24 3v6m0 30v6M3 24h6m30 0h6M9.2 9.2l4.3 4.3m21 21 4.3 4.3m0-29.6-4.3 4.3m-21 21-4.3 4.3" />
          </svg>
        </span>
        <p>Search a place to see what the sky is doing.</p>
      </section>
    );
  }

  return (
    <section className="weather">
      <div className="weather-visual">
        <div className="weather-icon-wrap">
          <img
            src={`https:${weather.condition.icon}`}
            alt=""
            width="112"
            height="112"
          />
        </div>
        <div className="weather-reading">
          <p className="temperature">
            {Math.round(weather.temp_c)}
            <span>°</span>
          </p>
          <p className="condition">{weather.condition.text}</p>
          <p className="feels-like">
            Feels like {Math.round(weather.feelslike_c)}°
          </p>
        </div>
      </div>
    </section>
  );
}
