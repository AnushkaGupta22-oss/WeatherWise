
import { useState } from "react";
import { getWeather } from "./services/weatherAPI";
import "./App.css";

function getWeatherCondition(code) {
  if (code === 0) return "Clear Sky";
  if ([1, 2, 3].includes(code)) return "Partly Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Unknown Condition";
}
function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "⛅";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌡️";
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const data = await getWeather(city.trim());

      setWeather(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <header>
        <h1>WeatherWise ☀️</h1>
        <p>Your daily weather companion</p>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search your city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="error">{error}</p>
      )}

      {loading && (
        <p className="loading">Fetching weather data...</p>
      )}

      {weather && (
        <div className="weather-card">

          <h2>
            {weather.location.name},
            {" "}{weather.location.country}
          </h2>

          <h1 className="temperature">
            {weather.weather.temperature_2m}°C
          </h1>

          <div className="condition-row">
            <span className="weather-icon">
                {getWeatherIcon(weather.weather.weather_code)}
            </span>

          <h3>
               {getWeatherCondition(weather.weather.weather_code)}
          </h3>
          </div>
          <div className="weather-details">

           <div>
              <h4>Today's High</h4>
              <p>{weather.weather.maxTemperature}°C</p>
           </div>

           <div> 
              <h4>Today's Low</h4>
              <p>{weather.weather.minTemperature}°C</p>
           </div>

            <div> 
               <h4>Feels Like</h4>
               <p>{weather.weather.apparent_temperature}°C</p>
            </div>

            <div>
              <h4>Humidity</h4>
              <p>{weather.weather.relative_humidity_2m}%</p>
            </div>

             <div>
                <h4>Wind Speed</h4>
                <p>{weather.weather.wind_speed_10m} km/h</p>
             </div>

          </div>
          <p className="updated">
            Weather data time: {weather.weather.time}
          </p>

        </div>
      )}

    </div>
  );
}

export default App;
