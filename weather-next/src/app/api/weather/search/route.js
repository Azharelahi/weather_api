export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return Response.json(
      { error: "A search query is required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Weather API key is missing." },
      { status: 500 }
    );
  }

  try {
    const apiURL = new URL("https://api.weatherapi.com/v1/search.json");
    apiURL.searchParams.set("key", apiKey);
    apiURL.searchParams.set("q", query);

    const response = await fetch(apiURL);
    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "Location search failed." },
        { status: response.status === 400 ? 400 : 502 }
      );
    }

    return Response.json(
      data.map(({ id, name, region, country }) => ({
        id,
        name,
        region,
        country,
      })),
      {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Weather location search error:", error);

    return Response.json(
      { error: "Could not connect to the location search provider." },
      { status: 502 }
    );
  }
}
