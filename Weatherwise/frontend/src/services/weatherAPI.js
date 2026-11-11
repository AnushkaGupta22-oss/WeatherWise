
const API_URL = "/api/weather";


export async function getWeather(city) {
    const response = await fetch(
        `/api/weather/${encodeURIComponent(city)}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}
