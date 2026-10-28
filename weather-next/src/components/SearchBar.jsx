
"use client";

export default function SearchBar({
  city,
  onCityChange,
  onSearch,
  loading,
}) {
  return (
    <form className="search" onSubmit={onSearch}>
      <input
        type="text"
        placeholder="Enter a city, e.g. Abbottabad"
        value={city}
        onChange={(event) => onCityChange(event.target.value)}
        aria-label="City name"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Get Weather"}
      </button>
    </form>
  );
}
