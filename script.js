let weatherData = "";

async function getWeather(city) {
  //Input weatherAPI key to run
  try {
    let response = await fetch(
      "https://api.weatherapi.com/v1/forecast.json?key=f79cafe4f5b64fae8eb151041232106&q=" +
        city +
        "&days=4&alerts=yes",
      { mode: "cors" }
    );
    weatherData = await response.json();
    //   console.log(weatherData);
    processWeatherData();
  } catch (error) {
    alert(
      "An Error has occurred fetching weather data! Please try your search again."
    );
  }
}
getWeather("cleveland");

function processWeatherData() {
  delete weatherData.location.localtime_epoch;
  delete weatherData.location.tz_id;
  delete weatherData.current.last_updated_epoch;
  delete weatherData.current.pressure_in;
  delete weatherData.current.pressure_mb;
  console.log(weatherData);
  populate();
  populateHeader();
  return weatherData;
}

function populate() {
  const heading = document.getElementsByClassName("heading");
  heading[0].textContent =
    "Weather in: " +
    weatherData.location.name +
    "," +
    weatherData.location.region;

  const today = document.getElementsByClassName("today");
  const forecastDiv = document.getElementsByClassName("forecast");
  while (today[0].firstChild) {
    today[0].removeChild(today[0].lastChild);
  }
  if (today[0].classList.contains("fade-in")) {
    today[0].classList.remove("fade-in");
    forecastDiv[0].classList.remove("fade-in");
    //offsetWidth queries the dom to force the browser
    //not to batch changes and performs a reflow of the page now
    today[0].offsetWidth;
    forecastDiv[0].offsetWidth;
    today[0].classList.add("fade-in");
    forecastDiv[0].classList.add("fade-in");
  } else {
    today[0].classList.add("fade-in");
    forecastDiv[0].classList.add("fade-in");
  }

  let cityName = document.createElement("div");
  cityName.classList.add("cityName");
  cityName.textContent = weatherData.location.name;
  today[0].appendChild(cityName);

  let currentTemp = document.createElement("div");
  currentTemp.classList.add("currentTemp");
  currentTemp.textContent = weatherData.current.temp_f + "\xB0";
  today[0].appendChild(currentTemp);

  let currentCond = document.createElement("div");
  currentCond.classList.add("currentCond");
  currentCond.textContent = weatherData.current.condition.text;
  today[0].appendChild(currentCond);

  let dailyTemp = document.createElement("div");
  dailyTemp.classList.add("dailyTemp");
  dailyTemp.textContent =
    "H:" +
    weatherData.forecast.forecastday[0].day.maxtemp_f +
    "\xB0 " +
    "  L:" +
    weatherData.forecast.forecastday[0].day.mintemp_f +
    "\xB0";
  today[0].appendChild(dailyTemp);

  let chanceRain = document.createElement("div");
  chanceRain.classList.add("chanceRain");
  chanceRain.textContent =
    "Rain: " +
    weatherData.forecast.forecastday[0].day.daily_chance_of_rain +
    "%";
  today[0].appendChild(chanceRain);

  // Daily condition
  let dailyCondition = document.createElement("div");
  dailyCondition.classList.add("dailyCondition");
  today[0].appendChild(dailyCondition);

  let currentTime = parseInt(weatherData.current.last_updated.slice(10, 13));
  // console.log(currentTime);

  for (i = currentTime; i < currentTime + 24; i++) {
    let j = 0;
    if (i > 23) {
      j = 1;
    }
    let k = i;
    if (i > 23) {
      k = i - 24;
    }
    let hourContainer = document.createElement("div");
    hourContainer.classList.add("hourContainer");

    let hourlyTime = document.createElement("div");
    hourlyTime.classList.add("hourlyTime");
    if (currentTime === i) {
      hourlyTime.textContent = "Now";
    } else {
      hourlyTime.textContent = k + ":00";
    }
    hourContainer.appendChild(hourlyTime);

    let hourlyImgContainer = document.createElement("div");
    hourlyImgContainer.classList.add("hourlyImgContainer");
    hourContainer.appendChild(hourlyImgContainer);

    let hourlyCondition = document.createElement("img");
    hourlyCondition.classList.add("hourlyCondition");
    hourlyCondition.src =
      weatherData.forecast.forecastday[j].hour[k].condition.icon;
    hourlyImgContainer.appendChild(hourlyCondition);

    let hourlyPercent = document.createElement("div");
    hourlyPercent.classList.add("hourlyPercent");
    if (
      weatherData.forecast.forecastday[j].hour[k].chance_of_rain !== 0 ||
      weatherData.forecast.forecastday[j].hour[k].chance_of_snow !== 0
    ) {
      let chance = Math.max(
        weatherData.forecast.forecastday[j].hour[k].chance_of_rain,
        weatherData.forecast.forecastday[j].hour[k].chance_of_snow
      );
      hourlyPercent.textContent = chance + "%";
      hourlyImgContainer.appendChild(hourlyPercent);
    }

    let hourlyTemp = document.createElement("div");
    hourlyTemp.classList.add("hourlyTemp");
    hourlyTemp.textContent =
      weatherData.forecast.forecastday[j].hour[k].temp_f + "\xB0";
    hourContainer.appendChild(hourlyTemp);

    dailyCondition.appendChild(hourContainer);
  }

  let sunriseSet = document.createElement("div");
  sunriseSet.classList.add("sunriseSet");
  sunriseSet.textContent =
    "Sunrise: " +
    weatherData.forecast.forecastday[0].astro.sunrise +
    " Sunset: " +
    weatherData.forecast.forecastday[0].astro.sunset;
  today[0].appendChild(sunriseSet);

  //Set background image for page
  backgroundWeatherTime(
    weatherData.current.condition.code,
    weatherData.current.last_updated.slice(10, 13)
  );
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
    // date.textContent = weatherData.forecast.forecastday[i + 1].date;
    date.textContent = dayName(weatherData.forecast.forecastday[i + 1].date);
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
}

function populateHeader() {
  const lastUpdated = document.getElementsByClassName("updated");
  lastUpdated[0].textContent =
    "Updated: " + weatherData.current.last_updated.slice(5);
  // change to say 'today' at xx time if it was updated today
}

const userCity = document.querySelector("input");
userCity.addEventListener("keydown", function (entry) {
  if (entry.code === "Enter") {
    let userEntry = entry.target.value;
    getWeather(userEntry);
  }
});

function backgroundWeatherTime(condition, time) {
  time = parseInt(time);
  // console.log(condition, time);
  let sunriseHour = weatherData.forecast.forecastday[0].astro.sunrise.slice(
    0,
    2
  );
  let sunsetHour =
    parseInt(weatherData.forecast.forecastday[0].astro.sunset.slice(0, 2)) + 12;
  // console.log(sunriseHour, sunsetHour);
  if (time < sunriseHour || time > sunsetHour) {
    backgroundWeatherNight(condition);
  } else {
    backgroundWeatherDay(condition);
  }
}
function backgroundWeatherNight(condition) {
  if (condition === 1000) {
    backgroundWeather("night-clear-timothee-duran.jpg");
  } else if (condition === 1003 || condition === 1006 || condition === 1009) {
    backgroundWeather("night-cloudy-quinton.jpg");
  } else {
    backgroundWeather("night-clear-timothee-duran.jpg");
  }
}
//Weather Code Info - https://www.weatherapi.com/docs/weather_conditions.json
function backgroundWeatherDay(condition) {
  if (condition === 1000) {
    backgroundWeather("day-clear-dave.jpg");
  } else if (condition === 1003) {
    backgroundWeather("day-partly-cloudy-em.jpg");
  } else if (condition === 1006 || condition === 1009) {
    backgroundWeather("day-cloudy-tobias.jpg");
  } else if (
    condition === 1087 ||
    condition === 1273 ||
    condition === 1276 ||
    condition === 1279 ||
    condition === 1282
  ) {
    backgroundWeather("day-thunderstorm-brandon.jpg");
  } else if (
    condition === 1030 ||
    condition === 1063 ||
    condition === 1150 ||
    condition === 1153 ||
    condition === 1180 ||
    condition === 1183 ||
    condition === 1186 ||
    condition === 1189 ||
    condition === 1192 ||
    condition === 1195 ||
    condition === 1240 ||
    condition === 1243 ||
    condition === 1246
  ) {
    backgroundWeather("day-rainy-valentin.jpg");
  }
}

function backgroundWeather(background) {
  let page = document.querySelector("html");
  page.style.backgroundImage = "url(" + background + ")";
  page.style.backgroundRepeat = "no-repeat";
  page.style.backgroundPosition = "center center";
  page.style.backgroundAttachment = "fixed";
  page.style.backgroundSize = "cover";
  // -webkit-background-size: cover;
  // -moz-background-size: cover;
  // -o-background-size: cover;
  // background-size: cover;
}

function dayName(dateString) {
  let date = new Date(dateString.replace(/-/g, "/").replace(/T.+/, ""));
  return date.toLocaleDateString("en-US", { weekday: "long" });
}
