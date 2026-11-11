
const express = require("express");

const router = express.Router();

// GET weather by city name
router.get("/:city", async (req, res) => {
    try {
        // Get city name from URL
        const city = req.params.city.trim();

        if (!city) {
            return res.status(400).json({
                success: false,
                message: "City name is required"
            });
        }

        // STEP 1: Get city coordinates
        const geoURL = new URL(
            "https://geocoding-api.open-meteo.com/v1/search"
        );

        geoURL.searchParams.set("name", city);
        geoURL.searchParams.set("count", "5");
        geoURL.searchParams.set("language", "en");
        geoURL.searchParams.set("format", "json");

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Geocoding API request failed");
        }

        const geoData = await geoResponse.json();

        // Check whether city exists
        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "City not found"
            });
        }

        // Get first matching city
        const location = geoData.results[0];

        const { latitude, longitude } = location;

        // STEP 2: Fetch weather data
        const weatherURL = new URL(
            "https://api.open-meteo.com/v1/forecast"
        );

        weatherURL.searchParams.set("latitude", latitude);
        weatherURL.searchParams.set("longitude", longitude);
        weatherURL.searchParams.set(
         "current",
          "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m"
        );

        weatherURL.searchParams.set(
         "daily",
         "temperature_2m_max,temperature_2m_min"
        );

        weatherURL.searchParams.set("timezone", "auto");

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather API request failed");
        }

        const weatherData = await weatherResponse.json();

        // STEP 3: Send response to frontend/client
        res.json({
            success: true,
            location: {
                name: location.name,
                country: location.country,
                state: location.admin1,
                latitude,
                longitude
            },
            weather: {
               ...weatherData.current,
               maxTemperature: weatherData.daily.temperature_2m_max[0],
               minTemperature: weatherData.daily.temperature_2m_min[0]
            }
        });

    } catch (error) {
        console.error("Weather Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch weather data"
        });
    }
});

module.exports = router;
