
function WeatherDisplay({ temperature, condition, icon }) {
  return (
    <section className="weather">
      {icon && (
        <img
          src={icon}
          alt={condition || "Weather condition"}
        />
      )}

      <p className="temperature">
        {temperature ?? "--"}°C
      </p>

      <p className="condition">
        {condition || "Weather condition will appear here"}
      </p>
    </section>
  );
}

export default WeatherDisplay;
