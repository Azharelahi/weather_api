
const fields = [
  { label: "Humidity", key: "humidity", unit: "%", mark: "H" },
  { label: "Wind speed", key: "wind_kph", unit: " km/h", mark: "W" },
  { label: "Cloud cover", key: "cloud", unit: "%", mark: "C" },
  { label: "Pressure", key: "pressure_mb", unit: " mb", mark: "P" },
  { label: "UV index", key: "uv", unit: "", mark: "UV" },
];

export default function WeatherDetails({ weather }) {
  return (
    <section className="details" aria-label="Weather details">
      {fields.map((field) => (
        <div className="detail" key={field.key}>
          <span className="detail-mark" aria-hidden="true">{field.mark}</span>
          <span className="detail-label">{field.label}</span>
          <strong className="detail-value">
            {weather ? `${weather[field.key]}${field.unit}` : "--"}
          </strong>
        </div>
      ))}
    </section>
  );
}
