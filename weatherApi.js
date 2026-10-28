
const http = require("node:http");
const https = require("node:https");
const { URL } = require("node:url");

const PORT = 3000;
const API_KEY = process.env.WEATHER_API_KEY;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  // Set response headers
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Serve the frontend
  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(getHTML());
    return;
  }

  // Weather API endpoint
  if (req.method === "GET" && url.pathname === "/api/weather") {
    if (!API_KEY) {
      res.writeHead(500, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify({
        error: "API key is missing. Add WEATHER_API_KEY to your .env file.",
      }));
      return;
    }

    const city = url.searchParams.get("city")?.trim();

    if (!city) {
      res.writeHead(400, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify({ error: "Please enter a city name." }));
      return;
    }

    try {
      const apiURL = new URL("https://api.weatherapi.com/v1/current.json");
      apiURL.searchParams.set("key", API_KEY);
      apiURL.searchParams.set("q", city);
      apiURL.searchParams.set("aqi", "no");

      const apiResponse = await fetch(apiURL);

      const contentType = apiResponse.headers.get("content-type") || "";
      const responseText = await apiResponse.text();

      if (!contentType.includes("application/json")) {
        console.error(
          "Weather API returned a non-JSON response:",
          apiResponse.status,
          responseText.slice(0, 300)
        );

        res.writeHead(502, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({
          error: "The weather provider returned an unexpected response. Try again later.",
        }));
        return;
      }

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        res.writeHead(502, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ error: "Invalid JSON received from the weather provider." }));
        return;
      }

      if (!apiResponse.ok) {
        const message = data.error?.message || "Weather request failed.";

        res.writeHead(apiResponse.status === 400 ? 400 : 502, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ error: message }));
        return;
      }

      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify(data));
    } catch (error) {
      console.error("Weather request error:", error.message);

      res.writeHead(502, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify({
        error: "Could not connect to the weather provider. Check your internet connection.",
      }));
    }

    return;
  }

  // Unknown route
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Route not found." }));
});

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather App</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      padding: 24px 16px;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #dbeafe, #eff6ff, #e0f2fe);
      color: #172554;
    }

    .container {
      width: 100%;
      max-width: 620px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      margin-bottom: 8px;
    }

    .subtitle {
      text-align: center;
      color: #475569;
      margin-bottom: 24px;
    }

    .card {
      background: white;
      padding: 24px;
      border-radius: 18px;
      box-shadow: 0 12px 35px rgba(15, 23, 42, 0.10);
    }

    .search {
      display: flex;
      gap: 10px;
      margin-bottom: 22px;
    }

    input {
      flex: 1;
      min-width: 0;
      padding: 12px;
      border: 1px solid #cbd5e1;
      border-radius: 9px;
      font-size: 16px;
    }

    button {
      padding: 12px 16px;
      border: none;
      border-radius: 9px;
      background: #2563eb;
      color: white;
      font-size: 15px;
      cursor: pointer;
    }

    button:hover {
      background: #1d4ed8;
    }

    button:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    #city {
      text-align: center;
      margin: 12px 0;
      font-size: 23px;
    }

    #status {
      text-align: center;
      color: #64748b;
      font-size: 14px;
      overflow-wrap: anywhere;
    }

    #weather {
      text-align: center;
      padding: 12px 0;
    }

    #weather img {
      width: 90px;
      height: 90px;
    }

    .temperature {
      font-size: 48px;
      font-weight: bold;
      margin: 0;
    }

    .condition {
      font-size: 20px;
      margin-top: 8px;
    }

    .details {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 22px;
    }

    .detail {
      background: #eff6ff;
      padding: 15px 10px;
      text-align: center;
      border-radius: 10px;
      overflow-wrap: anywhere;
    }

    .detail strong {
      display: block;
      margin-bottom: 7px;
      color: #1d4ed8;
    }

    .actions {
      margin-top: 22px;
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    details {
      margin-top: 22px;
    }

    summary {
      cursor: pointer;
      font-weight: bold;
    }

    pre {
      padding: 14px;
      background: #0f172a;
      color: #dbeafe;
      border-radius: 10px;
      overflow: auto;
      max-height: 350px;
      font-size: 12px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    @media (max-width: 440px) {
      .card {
        padding: 18px;
      }

      .search {
        flex-direction: column;
      }

      .search button {
        width: 100%;
      }

      .temperature {
        font-size: 40px;
      }
    }
  </style>
</head>

<body>
  <main class="container">
    <h1>Weather App</h1>
    <p class="subtitle">Check current weather for any city</p>

    <section class="card">
      <form id="searchForm" class="search">
        <input
          id="cityInput"
          type="text"
          placeholder="Enter a city, e.g. Abbottabad"
          value="Abbottabad"
          autocomplete="off"
          aria-label="City name"
          required
        >
        <button id="searchBtn" type="submit">Get Weather</button>
      </form>

      <h2 id="city">Choose a city</h2>
      <p id="status" role="status" aria-live="polite">Loading weather...</p>

      <section id="weather" aria-live="polite"></section>

      <div class="actions">
        <button id="refreshBtn" type="button">Refresh Weather</button>
      </div>

      <details>
        <summary>View complete API JSON response</summary>
        <pre id="raw">The API response will appear here.</pre>
      </details>
    </section>
  </main>

  <script>
    const searchForm = document.getElementById("searchForm");
    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const refreshBtn = document.getElementById("refreshBtn");
    const cityHeading = document.getElementById("city");
    const status = document.getElementById("status");
    const weather = document.getElementById("weather");
    const raw = document.getElementById("raw");

    async function loadWeather() {
      const city = cityInput.value.trim();

      if (!city) {
        status.textContent = "Please enter a city name.";
        cityInput.focus();
        return;
      }

      searchBtn.disabled = true;
      refreshBtn.disabled = true;
      status.textContent = "Loading weather...";
      weather.replaceChildren();
      raw.textContent = "";

      try {
        const response = await fetch(
          "/api/weather?city=" + encodeURIComponent(city)
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Weather request failed.");
        }

        cityHeading.textContent =
          data.location.name + ", " + data.location.country;

        status.textContent =
          "Last updated: " + data.current.last_updated;

        // Build the weather display safely using DOM methods.
        const icon = document.createElement("img");
        icon.src = "https:" + data.current.condition.icon;
        icon.alt = data.current.condition.text;

        const temperature = document.createElement("p");
        temperature.className = "temperature";
        temperature.textContent = data.current.temp_c + "°C";

        const condition = document.createElement("p");
        condition.className = "condition";
        condition.textContent = data.current.condition.text;

        const details = document.createElement("div");
        details.className = "details";

        const values = [
          ["Feels Like", data.current.feelslike_c + "°C"],
          ["Humidity", data.current.humidity + "%"],
          ["Wind", data.current.wind_kph + " km/h"],
          ["Cloud Cover", data.current.cloud + "%"],
          ["Pressure", data.current.pressure_mb + " mb"],
          ["UV Index", data.current.uv]
        ];

        for (const [label, value] of values) {
          const item = document.createElement("div");
          item.className = "detail";

          const title = document.createElement("strong");
          title.textContent = label;

          const reading = document.createElement("span");
          reading.textContent = value;

          item.append(title, reading);
          details.appendChild(item);
        }

        weather.append(icon, temperature, condition, details);
        raw.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        cityHeading.textContent = "Weather unavailable";
        status.textContent = "Error: " + error.message;
        raw.textContent = "";
      } finally {
        searchBtn.disabled = false;
        refreshBtn.disabled = false;
      }
    }

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      loadWeather();
    });

    refreshBtn.addEventListener("click", loadWeather);

    // Load the default city when the page opens.
    loadWeather();
  </script>
</body>
</html>`;
}

server.listen(PORT, () => {
  console.log(`Weather App running at http://localhost:${PORT}`);
});
