const Mustache = require("mustache");
const fs = require("fs");
const MUSTACHE_MAIN_DIR = "./main.mustache";

const { getWeatherDescription } = require('./api/getWeatherDescription.mjs')
const { getWeatherIcon } = require('./api/getWeatherIcon.mjs')
/**
 * DATA is the object that contains all
 * the data to be provided to Mustache
 * Notice the "name" and "date" property.
 */
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
    latitude: 14.595644624828882,
    longitude: 120.97649517150018,
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

/**
 * A - We open 'main.mustache'
 * B - We ask Mustache to render our file with the data
 * C - We create a README.md file with the generated output
 */
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
