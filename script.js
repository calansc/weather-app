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
  console.log(weatherData);
  populate();
  populateHeader();
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

  // let minTemp = document.createElement("div");
  // minTemp.classList.add("minTemp");
  // minTemp.textContent =
  //   "L: " + weatherData.forecast.forecastday[0].day.mintemp_f + "\xB0";
  // today[0].appendChild(minTemp);

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
  console.log(currentTime);

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
    hourlyTime.textContent = k + ":00";
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

  // let conditionIcon = document.createElement("img");
  // conditionIcon.classList.add("conditionIcon");
  // conditionIcon.src = weatherData.current.condition.icon;
  // dailyCondition.appendChild(conditionIcon);

  let sunrise = document.createElement("div");
  sunrise.classList.add("sunrise");
  sunrise.textContent =
    "Sunrise: " +
    weatherData.forecast.forecastday[0].astro.sunrise +
    " Sunset: " +
    weatherData.forecast.forecastday[0].astro.sunset;
  today[0].appendChild(sunrise);

  // let sunset = document.createElement("div");
  // sunset.classList.add("sunset");
  // sunset.textContent =
  //   "Sunset: " + weatherData.forecast.forecastday[0].astro.sunset;
  // today[0].appendChild(sunset);

  // Today Weather Background Graphics -- today only or full page??
  if (weatherData.current.condition.text === "Sunny") {
    document.getElementsByClassName("today")[0].style.backgroundImage =
      "url('day-clear-dave.jpg')";
    document.getElementsByClassName("today")[0].style.backgroundSize = "cover";
  } // Elses for different backgrounds/condition icons
  // Background changes for day/night

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
}

function populateHeader() {
  const lastUpdated = document.getElementsByClassName("updated");
  lastUpdated[0].textContent =
    "Last Updated: " + weatherData.current.last_updated;
  // change to say 'today' at xx time if it was updated today
}

const userCity = document.querySelector("input");
userCity.addEventListener("keydown", function (entry) {
  if (entry.code === "Enter") {
    let userEntry = entry.target.value;
    getWeather(userEntry);
  }
});
