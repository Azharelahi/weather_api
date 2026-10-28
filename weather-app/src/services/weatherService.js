
async function getWeather(city) {
  const response = await fetch(
    `/api/weather?city=${encodeURIComponent(city)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Weather request failed.");
  }

  return data;
}

export default getWeather;
