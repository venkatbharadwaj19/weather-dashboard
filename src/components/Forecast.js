import React from "react";

function Forecast({ data, unit, onSelectDay }) {
  const tempUnit = unit === "metric" ? "C" : "F";

  return (
    <div className="forecast">
      <h2>Coming 5 Days</h2>
      <div className="forecast-grid">
        {data.map((day, idx) => {
          const icon = day.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
          const dateObj = new Date(day.dt_txt);

          return (
            <div
              className="forecast-card"
              key={idx}
              onClick={() => onSelectDay(day)}
              title="Click for details"
            >
              <h3 style={{ margin: "0 0 6px" }}>
                {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
              </h3>
              <img src={iconUrl} alt={day.weather[0].description} />
              <p style={{ margin: 0, fontWeight: 700 }}>
                {Math.round(day.main.temp)}°{tempUnit}
              </p>
              <p style={{ margin: "4px 0 0", opacity: 0.9 }}>
                {day.weather[0].description}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 12, opacity: 0.85 }}>
                Min: {Math.round(day.main.temp_min)}° | Max: {Math.round(day.main.temp_max)}°
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 12, opacity: 0.8 }}>
                {dateObj.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Forecast;
