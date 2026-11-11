const weatherRoutes = require("./routes/weatherRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/weather", weatherRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to WeatherWise API!");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "WeatherWise backend is running!"
    });
});

const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:5007`);
});
