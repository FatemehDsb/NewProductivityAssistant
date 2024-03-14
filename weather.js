window.onload = async () => {
  async function getWeather(lat, lon, timezone) {
    try {
      let apiUrl =
        "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime";
      let response = await axios.get(apiUrl);

      let temperature = response.data.current.temperature_2m;
      let weatherTemp = document.getElementById("weatherTemp");
      weatherTemp.innerHTML = "";
      weatherTemp.innerHTML = `${temperature}°c`;
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  }
  navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

  function positionSuccess({ coords }) {
    getWeather(
      coords.latitude,
      coords.longitude,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
  }

  function positionError() {
    alert(
      "Please allow us to use your location and refresh the page, or you can't get weather info for your position."
    );
  }

  // return response.data.current.temperature_2m;
};
