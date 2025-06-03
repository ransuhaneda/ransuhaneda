const Mustache = require("mustache");
const fs = require("fs");
const MUSTACHE_MAIN_DIR = "./main.mustache";

const { getWeatherDescription } = require('./api/getWeatherDescription.mjs')
const { getWeatherIcon } = require('./api/getWeatherIcon.mjs')

let DATA = {
  name: "Lance",
  date: new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timezone: "Asia/Singapore",
  }),
};

async function setWeatherInformation() {
  const params = {
    latitude: 14.63,
    longitude: 121.00,
    daily: ["sunset", "sunrise", "weather_code"],
    current: ["temperature_2m", "weather_code"],
    timezone: "Asia/Singapore",
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  try {
    const response = await fetch(`${url}?${new URLSearchParams(params)}`);
    const data = await response.json();

    DATA.city_temperature = Math.round(data.current.temperature_2m);
    DATA.city_weather = getWeatherDescription(data.current.weather_code);
    DATA.city_weather_icon = getWeatherIcon(data.current.weather_code);

    DATA.sun_rise = new Date(data.daily.sunrise[0]).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Singapore",
    });
    DATA.sun_set = new Date(data.daily.sunset[0]).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Singapore",
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}

async function action() {
  await setWeatherInformation();
  await generateReadMe();
}

action();
