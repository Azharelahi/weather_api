
const fields = [
  { label: "Feels Like", key: "feelslike_c", unit: "°C" },
  { label: "Humidity", key: "humidity", unit: "%" },
  { label: "Wind", key: "wind_kph", unit: " km/h" },
  { label: "Cloud Cover", key: "cloud", unit: "%" },
  { label: "Pressure", key: "pressure_mb", unit: " mb" },
  { label: "UV Index", key: "uv", unit: "" },
];

export default function WeatherDetails({ weather }) {
  return (
    <div className="details">
      {fields.map((field) => (
        <div className="detail" key={field.key}>
          <strong>{field.label}</strong>
          <span>
            {weather ? `${weather[field.key]}${field.unit}` : "--"}
          </span>
        </div>
      ))}
    </div>
  );
}
