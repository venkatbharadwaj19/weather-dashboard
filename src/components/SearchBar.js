import React, { useState } from "react";

function SearchBar({ fetchWeather }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const c = city.trim();
    if (!c) return;
    fetchWeather(c);
    setCity("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">🔎 Search</button>
    </form>
  );
}

export default SearchBar;
