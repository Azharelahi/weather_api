
"use client";

import { useState } from "react";
import { useCitySuggestions } from "@/features/weather/hooks/useCitySuggestions";

export default function SearchBar({
  city,
  onCityChange,
  onSearch,
  onCitySelect,
  loading,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const {
    suggestions,
    loading: suggestionsLoading,
    error,
    isFeatured,
  } = useCitySuggestions(city, isOpen);
  const showSuggestions =
    isOpen &&
    (suggestions.length > 0 || suggestionsLoading || Boolean(error));

  function handleSubmit(event) {
    setIsOpen(false);
    onSearch(event);
  }

  function selectSuggestion(suggestion) {
    const place = [suggestion.name, suggestion.country]
      .filter(Boolean)
      .join(", ");

    setIsOpen(false);
    setActiveIndex(-1);
    onCityChange(place);
    onCitySelect(place);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!suggestions.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <div className="search-field">
        <input
          type="text"
          placeholder="Enter a city, e.g. Abbottabad"
          value={city}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onChange={(event) => {
            onCityChange(event.target.value);
            setActiveIndex(-1);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-label="City name"
          aria-autocomplete="list"
          aria-expanded={Boolean(showSuggestions)}
          aria-controls="city-suggestions"
          aria-activedescendant={
            activeIndex >= 0 ? `city-suggestion-${activeIndex}` : undefined
          }
          autoComplete="off"
          required
        />

        {showSuggestions && (
          <div className="city-suggestions">
            <p className="suggestion-heading">
              {isFeatured ? "Popular places in Pakistan" : "Matching places"}
            </p>
            <ul id="city-suggestions" role="listbox" aria-label="Matching locations">
              {suggestions.map((suggestion, index) => (
                <li
                  className="suggestion-option"
                  id={`city-suggestion-${index}`}
                  key={suggestion.id}
                  role="option"
                  aria-selected={activeIndex === index}
                  onPointerDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <span className="suggestion-name">
                    <span className="suggestion-pin" aria-hidden="true">
                      {isFeatured ? "✦" : "⌖"}
                    </span>
                    {suggestion.name}
                  </span>
                  <span className="suggestion-location">
                    {[suggestion.region, suggestion.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </li>
              ))}
            </ul>
            {suggestionsLoading && (
              <p className="suggestion-message" role="status">
                Finding more matching places...
              </p>
            )}
            {!suggestionsLoading && error && (
              <p className="suggestion-message" role="status">
                Live suggestions are unavailable; Pakistan places are still searchable.
              </p>
            )}
            {!suggestions.length && !suggestionsLoading && !error && (
              <p className="suggestion-message" role="status">
                No matching places found. You can still search for this location.
              </p>
            )}
          </div>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Get Weather"}
      </button>
    </form>
  );
}
