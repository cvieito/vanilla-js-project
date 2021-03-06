function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayWeatherCondition(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#weather-description");
  let iconElement = document.querySelector("#icon");
  let maxTemperatureElement = document.querySelector("#max-temp");
  let minTemperatureElement = document.querySelector("#min-temp");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");

  celsiusTemperature = response.data.main.temp;
  maxCelsiusElement = response.data.main.temp_max;
  minCelsiusElement = response.data.main.temp_min;
  console.log(response.data.main.temp_max);

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  maxTemperatureElement.innerHTML = Math.round(maxCelsiusElement);
  minTemperatureElement.innerHTML = Math.round(minCelsiusElement);
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed * 0.001 * 3600);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];

    forecastElement.innerHTML += `
    <div class="col">
      <h4 class="hours">
      ${formatHours(forecast.dt * 1000)}
      </h4>
      <img
        src="http://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png"
      />
      <div class="weather-forecast-temperature">
        <strong id="max-forecast">
        ${Math.round(forecast.main.temp_max)}°
        </strong> 
        <span id="min-forecast"> ${Math.round(forecast.main.temp_min)}° </span>
      </div>
    </div>
    `;

    maxCelsiusForecast = forecast.main.temp_max;
    minCelsiusForecast = forecast.main.temp_min;
  }
}

function searchCity(city) {
  let apiKey = "352858b872f9136668a7d5437feb3f30";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition); // we're calling the function displayWeatherCondition written above

  // forecast
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  searchCity(cityInput); // we're calling the function search written above...
}

function searchLocation(position) {
  let apiKey = "352858b872f9136668a7d5437feb3f30";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  // I want to do a new API call, we can google "js current location" and copy the code
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  // when I click on ºF I want to remove the active class on the celsius link...
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  let maxTemperatureElement = document.querySelector("#max-temp");
  let maxFahrenheitElement = (maxCelsiusElement * 9) / 5 + 32;
  maxTemperatureElement.innerHTML = Math.round(maxFahrenheitElement);

  let minTemperatureElement = document.querySelector("#min-temp");
  let minFahrenheitElement = (minCelsiusElement * 9) / 5 + 32;
  minTemperatureElement.innerHTML = Math.round(minFahrenheitElement);

  let maxForecastElement = document.querySelector("#max-forecast");
  let maxFahrenheitForecast = (maxCelsiusForecast * 9) / 5 + 32;
  maxForecastElement.innerHTML = Math.round(maxFahrenheitForecast);

  let minForecastElement = document.querySelector("#min-forecast");
  let minFahrenheitForecast = (minCelsiusForecast * 9) / 5 + 32;
  minForecastElement.innerHTML = Math.round(minFahrenheitForecast);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let maxTemperatureElement = document.querySelector("#max-temp");
  maxTemperatureElement.innerHTML = Math.round(maxCelsiusElement);

  let minTemperatureElement = document.querySelector("#min-temp");
  minTemperatureElement.innerHTML = Math.round(minCelsiusElement);

  let maxForecastElement = document.querySelector("#max-forecast");
  maxForecastElement.innerHTML = Math.round(maxCelsiusForecast);

  let minForecastElement = document.querySelector("#min-forecast");
  minForecastElement.innerHTML = Math.round(minCelsiusForecast);
}

let celsiusTemperature = null;

let dateElement = document.querySelector("#date");
let date = new Date();
dateElement.innerHTML = formatDate(date);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#btn-current");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

searchCity("Viana do Castelo");
