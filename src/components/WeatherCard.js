import React from "react";
import Tooltip from "./Tooltip";

function WeatherCard({ data, unit }) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const tempUnit = unit === "metric" ? "C" : "F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className="weather-card">
      <h2>
        {data.name}, {data.sys.country}
      </h2>

      <img src={iconUrl} alt={data.weather[0].description} />

      {/* Temperature */}
      <Tooltip
        text={
          `🌡 Temperature: ${Math.round(data.main.temp)}°${tempUnit}\n` +
          `Category: ${
            data.main.temp < 15 ? "Low" : data.main.temp <= 30 ? "Medium" : "High"
          }\n` +
          `Unit: ${tempUnit === "C" ? "Celsius (C)" : "Fahrenheit (F)"}`
        }
      >
        <h3>
          {Math.round(data.main.temp)}°{tempUnit}
        </h3>
      </Tooltip>

      <p style={{ letterSpacing: "1px" }}>
        {data.weather[0].description.toUpperCase()}
      </p>

      {/* Humidity, Pressure, Wind in one line */}
      <div style={{ display: "flex", gap: "30px", marginTop: "10px" }}>
        {/* Humidity */}
        <Tooltip
          text={
            `💧 Humidity: ${data.main.humidity}%\n` +
            `Category: ${
              data.main.humidity < 40 ? "Low" : data.main.humidity <= 70 ? "Medium" : "High"
            }\n` +
            `Unit: Percentage (%)`
          }
        >
          <p>Humidity: {data.main.humidity}%</p>
        </Tooltip>

        {/* Pressure */}
        <Tooltip
          text={
            `⏲ Pressure: ${data.main.pressure} hPa\n` +
            `Category: ${
              data.main.pressure < 1000 ? "Low" : data.main.pressure <= 1020 ? "Normal" : "High"
            }\n` +
            `Unit: hectoPascal (hPa)`
          }
        >
          <p>Pressure: {data.main.pressure} hPa</p>
        </Tooltip>

        {/* Wind */}
        <Tooltip
          text={
            `💨 Wind Speed: ${data.wind.speed} ${speedUnit}\n` +
            `Category: ${
              data.wind.speed < 3 ? "Low" : data.wind.speed <= 8 ? "Medium" : "High"
            }\n` +
            `Unit: ${speedUnit === "m/s" ? "meters/second" : "miles/hour"}`
          }
        >
          <p>Wind: {data.wind.speed} {speedUnit}</p>
        </Tooltip>
      </div>
    </div>
  );
}

export default WeatherCard;
