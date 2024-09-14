// src/components/SearchBar.jsx
import './FastFinder.css';
import React, { useState, useEffect, useRef } from 'react';

const FastFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [data, setData] = useState([]);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Fetch data from local JSON file
    fetch('/Data.json')
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const filteredSuggestions = data.filter((item) =>
        item.country.toLowerCase().includes(lowerCaseTerm) ||
        item.capital.toLowerCase().includes(lowerCaseTerm)
      );

      // Separate results by type: country vs capital
      const suggestionsForCountries = filteredSuggestions.filter((item) =>
        item.country.toLowerCase().includes(lowerCaseTerm)
      );
      const suggestionsForCapitals = filteredSuggestions.filter((item) =>
        item.capital.toLowerCase().includes(lowerCaseTerm)
      );

      setSuggestions(
        searchTerm.length > 0
          ? [...new Set([...suggestionsForCountries, ...suggestionsForCapitals])]
          : []
      );
    } else {
      setSuggestions([]);
    }
    setActiveSuggestionIndex(-1); // Reset active suggestion index
  }, [searchTerm, data]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (event.key === 'Enter') {
      if (activeSuggestionIndex >= 0) {
        const selectedSuggestion = suggestions[activeSuggestionIndex];
        setSearchTerm(
          selectedSuggestion.country.toLowerCase().includes(searchTerm.toLowerCase())
            ? selectedSuggestion.country
            : selectedSuggestion.capital
        );
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(
      suggestion.country.toLowerCase().includes(searchTerm.toLowerCase())
        ? suggestion.country
        : suggestion.capital
    );
    setSuggestions([]);
  };

  return (
    <div className="search-container">
      <h3 className="heading">Search for Countries or Capitals</h3>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by country or capital"
        />
        {suggestions.length > 0 && (
          <ul className="search-results" ref={suggestionsRef}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`search-results-item ${
                  index === activeSuggestionIndex ? 'active' : ''
                }`}
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                <strong>Country:</strong> {suggestion.country} <br />
                <strong>Capital:</strong> {suggestion.capital}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FastFinder;