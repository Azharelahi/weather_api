
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Weather API key is missing. Check .env.local." },
      { status: 500 }
    );
  }

  if (!city) {
    return Response.json(
      { error: "Please enter a city name." },
      { status: 400 }
    );
  }

  try {
    const apiURL = new URL(
      "https://api.weatherapi.com/v1/current.json"
    );

    apiURL.searchParams.set("key", apiKey);
    apiURL.searchParams.set("q", city);
    apiURL.searchParams.set("aqi", "no");

    const response = await fetch(apiURL);
    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "Weather request failed." },
        { status: response.status === 400 ? 400 : 502 }
      );
    }

    return Response.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Weather API error:", error.message);

    return Response.json(
      { error: "Could not connect to the weather provider." },
      { status: 502 }
    );
  }
}
