import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import "./App.css";

// 🔑 DIRECT API KEY (no .env)
const API_KEY = "4cee1bb36b91e86215208ab17b380a70";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [unit, setUnit] = useState("metric"); // "metric" | "imperial"
  const [selectedDay, setSelectedDay] = useState(null);

  const tempUnit = unit === "metric" ? "C" : "F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  const conditionMain = useMemo(
    () => (weather?.weather?.[0]?.main || "").toLowerCase(),
    [weather]
  );

  // --- Helpers ---
  const processForecast = (list) => {
    const daily = list.filter((i) => i.dt_txt.includes("12:00:00")).slice(0, 5);
    setForecast(daily);
  };

  // --- API Calls ---
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError("");
      const [curRes, fcRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
        ),
      ]);
      const curData = await curRes.json();
      const fcData = await fcRes.json();
      if (curData.cod !== 200) throw new Error("Failed current weather");
      setWeather(curData);
      processForecast(fcData.list || []);
    } catch (e) {
      setError("Unable to fetch location weather.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError("");
      const [curRes, fcRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&appid=${API_KEY}&units=${unit}`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            city
          )}&appid=${API_KEY}&units=${unit}`
        ),
      ]);
      const curData = await curRes.json();
      const fcData = await fcRes.json();
      if (curData.cod === "404" || curData.cod === 404) {
        setError("This place does not exist! Please try again.");
        setWeather(null);
        setForecast([]);
        return;
      }
      if (curData.cod !== 200) {
        setError("Unable to fetch weather. Please check your connection.");
        setWeather(null);
        setForecast([]);
        return;
      }
      setWeather(curData);
      processForecast(fcData.list || []);
    } catch (e) {
      setError("Unable to fetch weather. Please check your connection.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => setError("Location access denied. Please search manually.")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  useEffect(() => {
    const b = document.body;
    b.className = "";
    if (!weather) {
      b.classList.add("default-bg");
      return;
    }
    if (conditionMain.includes("rain")) b.classList.add("rainy-bg");
    else if (conditionMain.includes("snow")) b.classList.add("snowy-bg");
    else if (conditionMain.includes("cloud")) b.classList.add("cloudy-bg");
    else if (conditionMain.includes("clear")) b.classList.add("sunny-bg");
    else b.classList.add("default-bg");
  }, [weather, conditionMain]);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setSelectedDay(null);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // --- Categorization Helpers ---
  const categorize = (type, value) => {
    switch (type) {
      case "humidity":
        if (value < 30) return "Low";
        if (value < 70) return "Medium";
        return "High";
      case "pressure":
        if (value < 1000) return "Low";
        if (value < 1020) return "Medium";
        return "High";
      case "temp":
        if (unit === "metric") {
          if (value < 10) return "Low";
          if (value < 25) return "Medium";
          return "High";
        } else {
          if (value < 50) return "Low";
          if (value < 77) return "Medium";
          return "High";
        }
      case "visibility":
        if (value < 2) return "Low";
        if (value < 6) return "Medium";
        return "High";
      default:
        return "";
    }
  };

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      {/* Ambient weather overlays */}
      {conditionMain.includes("rain") && <div className="anim rain" />}
      {conditionMain.includes("snow") && <div className="anim snow" />}
      {conditionMain.includes("clear") && <div className="anim sun" />}

      <header className="topbar">
        <h1 className="brand">🌦 Weather Dashboard</h1>
        <div className="controls">
          <button onClick={() => setDarkMode((d) => !d)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            onClick={() => setUnit((u) => (u === "metric" ? "imperial" : "metric"))}
          >
            {unit === "metric" ? "Switch to °F" : "Switch to °C"}
          </button>
          <button
            onClick={() => {
              if (!navigator.geolocation) return;
              navigator.geolocation.getCurrentPosition(
                (pos) =>
                  fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
                () => setError("Location denied.")
              );
            }}
          >
            📍 Current Location
          </button>
        </div>
      </header>

      <SearchBar fetchWeather={fetchWeather} />

      {loading && (
        <div className="loading-container">
          <p className="loading-text">Loading</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}

      {/* Modal detail for selected day */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDay(null)}>
              ⬅ Back
            </button>
            <h2>
              {new Date(selectedDay.dt_txt).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${selectedDay.weather[0].icon}@4x.png`}
              alt={selectedDay.weather[0].description}
            />
            <h3>
              {Math.round(selectedDay.main.temp)}°{tempUnit}
            </h3>
            <p>{selectedDay.weather[0].description.toUpperCase()}</p>
            <div className="modal-stats">
              <span>Humidity: {selectedDay.main.humidity}%</span>
              <span>
                Wind: {selectedDay.wind.speed} {speedUnit}
              </span>
              <span>
                Min: {Math.round(selectedDay.main.temp_min)}° / Max:{" "}
                {Math.round(selectedDay.main.temp_max)}°
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {weather && (
        <div className="dashboard">
          <div className="card card-big">
            <WeatherCard data={weather} unit={unit} />
            <div className="datetime">
              <div>📅 {new Date().toLocaleDateString()}</div>
              <div>🕒 {new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          {/* ✅ Updated stats with tooltips */}
          <div
            className="card stat"
            title={`Humidity: ${categorize("humidity", weather.main.humidity)} (Relative Humidity in %)`}
          >
            <div className="stat-title">Humidity</div>
            <div className="stat-value">{weather.main.humidity}%</div>
          </div>

          <div
            className="card stat"
            title={`Pressure: ${categorize("pressure", weather.main.pressure)} (hPa = hectopascal)`}
          >
            <div className="stat-title">Pressure</div>
            <div className="stat-value">{weather.main.pressure} hPa</div>
          </div>

          <div
            className="card stat"
            title={`Feels Like: ${categorize("temp", weather.main.feels_like)} (°${tempUnit})`}
          >
            <div className="stat-title">Feels Like</div>
            <div className="stat-value">
              {Math.round(weather.main.feels_like)}°{tempUnit}
            </div>
          </div>

          <div
            className="card stat"
            title={`Visibility: ${categorize(
              "visibility",
              (weather.visibility || 0) / 1000
            )} (in km)`}
          >
            <div className="stat-title">Visibility</div>
            <div className="stat-value">
              {Math.round((weather.visibility || 0) / 1000)} km
            </div>
          </div>

          <div className="card sunbox">
            <div className="section-title">Sunrise & Sunset</div>
            <div className="sun-grid">
              <div className="sun-item">
                <div className="sun-icon">🌅</div>
                <div className="sun-label">Sunrise</div>
                <div className="sun-time">
                  {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
                </div>
              </div>
              <div className="sun-item">
                <div className="sun-icon">🌙</div>
                <div className="sun-label">Sunset</div>
                <div className="sun-time">
                  {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          <div className="card forecastPane">
            <Forecast data={forecast} unit={unit} onSelectDay={setSelectedDay} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
