
export default function WeatherDisplay({ weather }) {
  if (!weather) {
    return (
      <section className="weather">
        <p>Search for a city to see its weather.</p>
      </section>
    );
  }

  return (
    <section className="weather">
      <img
        src={`https:${weather.condition.icon}`}
        alt={weather.condition.text}
        width="90"
        height="90"
      />

      <p className="temperature">{weather.temp_c}°C</p>

      <p className="condition">{weather.condition.text}</p>
    </section>
  );
}
