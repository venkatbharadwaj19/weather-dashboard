// Interpretation of values
export function interpretValue(type, value) {
  switch (type) {
    case "temp":
      if (value < 10) return `Low ❄️ (Cold)`;
      if (value < 25) return `Moderate 🌤️`;
      return `High 🔥 (Hot)`;

    case "humidity":
      if (value < 30) return `Low (Dry)`;
      if (value < 60) return `Moderate`;
      return `High (Humid)`;

    case "pressure":
      if (value < 1000) return `Low (Possible Rain)`;
      if (value < 1020) return `Normal`;
      return `High (Stable, Clear Skies)`;

    case "wind":
      if (value < 5) return `Calm Breeze 🌬️`;
      if (value < 15) return `Moderate Wind 💨`;
      return `High Wind 🌪️`;

    case "visibility":
      if (value > 10) return `Excellent 🌞`;
      if (value > 5) return `Moderate`;
      return `Low (Foggy / Dusty)`;

    default:
      return "No interpretation available";
  }
}

// Units full forms
export const unitMeanings = {
  "°C": "Celsius",
  "°F": "Fahrenheit",
  "hPa": "Hectopascal (pressure unit)",
  "m/s": "Meters per second (wind speed)",
  "mph": "Miles per hour (wind speed)",
  "km": "Kilometers (visibility)",
  "%": "Relative Humidity"
};
