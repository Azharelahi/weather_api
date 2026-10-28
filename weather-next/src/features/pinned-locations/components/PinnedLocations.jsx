
"use client";

export default function PinnedLocations({
  locations = [],
  onSelect,
  onRemove,
  loading = false,
  currentLocation = null,
}) {
  const isCurrentLocationPinned = (pinnedCity) =>
    currentLocation &&
    pinnedCity.name.toLowerCase() ===
      currentLocation.name.toLowerCase() &&
    pinnedCity.country.toLowerCase() ===
      currentLocation.country.toLowerCase();

  return (
    <section className="card pinned-section">
      <h2>📌 Pinned Locations</h2>

      {locations.length === 0 ? (
        <p>
          No pinned locations yet. Search for a city and pin it
          to access it after refreshing the page.
        </p>
      ) : (
        <ul className="pinned-list">
          {locations.map((pinnedCity) => (
            <li
              key={`${pinnedCity.name}-${pinnedCity.country}`}
              className="pinned-item"
            >
              <button
                type="button"
                onClick={() => onSelect(pinnedCity)}
                disabled={loading}
              >
                {pinnedCity.name}, {pinnedCity.country}
                {isCurrentLocationPinned(pinnedCity) ? " ✓" : ""}
              </button>

              <button
                type="button"
                aria-label={`Remove ${pinnedCity.name}`}
                onClick={() => onRemove(pinnedCity)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
