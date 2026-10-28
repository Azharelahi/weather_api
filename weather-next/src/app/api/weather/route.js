export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const city = searchParams.get("city")?.trim();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Weather API key is missing." },
      { status: 500 }
    );
  }

  if (!city && (!lat || !lon)) {
    return Response.json(
      { error: "City or location coordinates are required." },
      { status: 400 }
    );
  }

  try {
    const apiURL = new URL(
      "https://api.weatherapi.com/v1/current.json"
    );

    apiURL.searchParams.set("key", apiKey);
    apiURL.searchParams.set("aqi", "no");

    if (city) {
      apiURL.searchParams.set("q", city);
    } else {
      apiURL.searchParams.set("q", `${lat},${lon}`);
    }

    const response = await fetch(apiURL);
    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error:
            data.error?.message || "Weather request failed.",
        },
        {
          status: response.status === 400 ? 400 : 502,
        }
      );
    }

    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Weather API error:", error);

    return Response.json(
      {
        error: "Could not connect to the weather provider.",
      },
      { status: 502 }
    );
  }
}