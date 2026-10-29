export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return Response.json(
      { error: "A search query is required." },
      { status: 400 }
    );
  }

  try {
    const apiURL = new URL(
      "https://geocoding-api.open-meteo.com/v1/search"
    );
    apiURL.searchParams.set("name", query);
    apiURL.searchParams.set("count", "10");
    apiURL.searchParams.set("language", "en");
    apiURL.searchParams.set("format", "json");

    const response = await fetch(apiURL, { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: "Location search failed." },
        { status: response.status === 400 ? 400 : 502 }
      );
    }

    return Response.json(
      (data.results || []).map(
        ({ id, name, admin1, country, country_code, latitude, longitude }) => ({
          id,
          name,
          region: admin1 || "",
          country,
          countryCode: country_code,
          latitude,
          longitude,
        })
      ),
      {
        headers: {
          "Cache-Control": "no-store",
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
