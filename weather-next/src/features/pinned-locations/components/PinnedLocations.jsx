
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
      <div className="pinned-heading">
        <div>
          <p className="section-eyebrow">YOUR SAVED PLACES</p>
          <h2>Pinned locations</h2>
        </div>
        <span className="pinned-count">{locations.length}</span>
      </div>

      {locations.length === 0 ? (
        <div className="pinned-empty">
          <p>Your favorite places will feel right at home here.</p>
          <span>Search for a city and pin it for a quicker forecast next time.</span>
        </div>
      ) : (
        <ul className="pinned-list">
          {locations.map((pinnedCity) => (
            <li
              key={`${pinnedCity.name}-${pinnedCity.country}`}
              className="pinned-item"
            >
              <div className="pinned-place">
                <span className="pinned-place-mark" aria-hidden="true">
                  {pinnedCity.name.slice(0, 1).toUpperCase()}
                </span>
                <button
                  className="pinned-select"
                  type="button"
                  onClick={() => onSelect(pinnedCity)}
                  disabled={loading}
                >
                  <span>{pinnedCity.name}</span>
                  <small>{pinnedCity.country}</small>
                </button>
                {isCurrentLocationPinned(pinnedCity) && (
                  <span className="current-place">CURRENT</span>
                )}
              </div>
              <button
                className="pinned-remove"
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
