export function getWeatherIcon(code) {
  const iconMap = {
    0: "01d",  // clear sky
    1: "02d",  // few clouds
    2: "03d",  // scattered clouds
    3: "04d",  // broken clouds
    45: "50d", // fog
    48: "50d", // fog
    51: "09d", // drizzle
    53: "09d",
    55: "09d",
    61: "10d", // rain
    63: "10d",
    65: "10d",
    71: "13d", // snow
    73: "13d",
    75: "13d",
    80: "09d", // shower rain
    81: "09d",
    82: "09d",
    95: "11d", // thunderstorm
    96: "11d",
    99: "11d"
  }; 

  return iconMap[code] || "01d";
}