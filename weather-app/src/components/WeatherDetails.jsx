
function WeatherDetails({ weather }) {
  const details = [
    {
      label: "Feels Like",
      value: weather?.feelslike_c != null
        ? `${weather.feelslike_c}°C`
        : "--",
    },
    {
      label: "Humidity",
      value: weather?.humidity != null
        ? `${weather.humidity}%`
        : "--",
    },
    {
      label: "Wind",
      value: weather?.wind_kph != null
        ? `${weather.wind_kph} km/h`
        : "--",
    },
    {
      label: "Cloud Cover",
      value: weather?.cloud != null
        ? `${weather.cloud}%`
        : "--",
    },
    {
      label: "Pressure",
      value: weather?.pressure_mb != null
        ? `${weather.pressure_mb} mb`
        : "--",
    },
    {
      label: "UV Index",
      value: weather?.uv != null
        ? weather.uv
        : "--",
    },
  ];

  return (
    <div className="details">
      {details.map((detail) => (
        <div className="detail" key={detail.label}>
          <strong>{detail.label}</strong>
          <span>{detail.value}</span>
        </div>
      ))}
    </div>
  );
}

export default WeatherDetails;
