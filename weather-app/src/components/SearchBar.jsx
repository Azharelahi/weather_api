
function SearchBar({ city, onCityChange, onSearch }) {
  return (
    <form className="search" onSubmit={onSearch}>
      <input
        type="text"
        placeholder="Enter a city, e.g. Abbottabad"
        value={city}
        onChange={(event) => onCityChange(event.target.value)}
        aria-label="City name"
      />

      <button type="submit">Get Weather</button>
    </form>
  );
}

export default SearchBar;
