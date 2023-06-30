let weatherData = "";

async function getWeather(city) {
  //Input weatherAPI key to run
  let response = await fetch(
    "http://api.weatherapi.com/v1/forecast.json?key=f79cafe4f5b64fae8eb151041232106&q=" +
      city +
      "&days=4",
    { mode: "cors" }
  );
  weatherData = await response.json();
  //   console.log(weatherData);
  processWeatherData();
}
getWeather("cleveland");

function processWeatherData() {
  delete weatherData.location.localtime_epoch;
  delete weatherData.location.tz_id;
  delete weatherData.current.last_updated_epoch;
  delete weatherData.current.pressure_in;
  delete weatherData.current.pressure_mb;
  // delete weatherData.current.last_updated_epoch;
  console.log(weatherData);
  populate();
}

function populate() {
  const heading = document.getElementsByClassName("heading");
  heading[0].textContent =
    "Weather in: " +
    weatherData.location.name +
    "," +
    weatherData.location.region;

  const today = document.getElementsByClassName("today");
  while (today[0].firstChild) {
    today[0].removeChild(today[0].lastChild);
  }
  // for (let i = 0; i < Object.keys(weatherData.current).length; i++) {
  //   let div = document.createElement("div");
  //   div.classList.add("keys");
  //   div.textContent = Object.keys(weatherData.current)[i];
  //   let div2 = document.createElement("div");
  //   div2.classList.add("values");
  //   div2.textContent = Object.values(weatherData.current)[i];
  //   today[0].appendChild(div);
  //   today[0].appendChild(div2);
  // }

  let date = document.createElement("div");
  date.classList.add("date");
  date.textContent = weatherData.current.date;
  today[0].appendChild(date);

  let maxTemp = document.createElement("div");
  maxTemp.classList.add("maxTemp");
  maxTemp.textContent = "High: " + weatherData.current.day.maxtemp_f + "\xB0";
  today[0].appendChild(maxTemp);

  let minTemp = document.createElement("div");
  minTemp.classList.add("minTemp");
  minTemp.textContent = "Low: " + weatherData.current.day.mintemp_f + "\xB0";
  today[0].appendChild(minTemp);

  let chanceRain = document.createElement("div");
  chanceRain.classList.add("chanceRain");
  chanceRain.textContent =
    "Rain: " + weatherData.current.day.daily_chance_of_rain + "%";
  today[0].appendChild(chanceRain);

  let conditionIcon = document.createElement("img");
  conditionIcon.classList.add("conditionIcon");
  conditionIcon.src = weatherData.current.day.condition.icon;
  today[0].appendChild(conditionIcon);

  let sunrise = document.createElement("div");
  sunrise.classList.add("sunrise");
  sunrise.textContent = "Sunrise: " + weatherData.current.astro.sunrise;
  today[0].appendChild(sunrise);

  let sunset = document.createElement("div");
  sunset.classList.add("sunset");
  sunset.textContent = "Sunset: " + weatherData.current.astro.sunset;
  today[0].appendChild(sunset);

  // Today above **********************************
  // Forecast days below
  const day = document.getElementsByClassName("day");
  for (let i = 0; i < day.length; i++) {
    while (day[i].firstChild) {
      day[i].removeChild(day[i].lastChild);
    }
  }
  for (let i = 0; i < day.length; i++) {
    let date = document.createElement("div");
    date.classList.add("date");
    date.textContent = weatherData.forecast.forecastday[i + 1].date;
    day[i].appendChild(date);

    let maxTemp = document.createElement("div");
    maxTemp.classList.add("maxTemp");
    maxTemp.textContent =
      "High: " + weatherData.forecast.forecastday[i + 1].day.maxtemp_f + "\xB0";
    day[i].appendChild(maxTemp);

    let minTemp = document.createElement("div");
    minTemp.classList.add("minTemp");
    minTemp.textContent =
      "Low: " + weatherData.forecast.forecastday[i + 1].day.mintemp_f + "\xB0";
    day[i].appendChild(minTemp);

    let chanceRain = document.createElement("div");
    chanceRain.classList.add("chanceRain");
    chanceRain.textContent =
      "Rain: " +
      weatherData.forecast.forecastday[i + 1].day.daily_chance_of_rain +
      "%";
    day[i].appendChild(chanceRain);

    let conditionIcon = document.createElement("img");
    conditionIcon.classList.add("conditionIcon");
    conditionIcon.src =
      weatherData.forecast.forecastday[i + 1].day.condition.icon;
    day[i].appendChild(conditionIcon);

    let sunrise = document.createElement("div");
    sunrise.classList.add("sunrise");
    sunrise.textContent =
      "Sunrise: " + weatherData.forecast.forecastday[i + 1].astro.sunrise;
    day[i].appendChild(sunrise);

    let sunset = document.createElement("div");
    sunset.classList.add("sunset");
    sunset.textContent =
      "Sunset: " + weatherData.forecast.forecastday[i + 1].astro.sunset;
    day[i].appendChild(sunset);
  }
  // Forecast Days Above
  // Header below************

  const lastUpdated = document.querySelector("updated");
  lastUpdated[0].textContent =
    "Last Updated: " + weatherData.current.last_updated_date;
  // ^^ may need to update variable for this
}

const userCity = document.querySelector("input");
userCity.addEventListener("keydown", function (entry) {
  if (entry.code === "Enter") {
    let userEntry = entry.target.value;
    getWeather(userEntry);
  }
});
