navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitudem,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
}

function positionError() {
  alert(
    "Please allow us to use your location and refresh the page. Otherwise you'll be left with the weather for Stockholm, Sweden."
  );
}

window.onload = async () => {
  //WEATHER STARTS
  let getWeather = async () => {
    let response = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=59.3294&longitude=18.0687&current=temperature_2m,weather_code&wind_speed_unit=mph&timeformat=unixtime&timezone=Europe%2FBerlin",
      {
        params: {
          inc: "latitude, longitude, timezone, current",
        },
      }
    );
    return response.data.current.temperature_2m;
  };

  let weatherTemp = document.getElementById("weatherTemp");

  let temperature = await getWeather();

  weatherTemp.innerHTML = "";
  weatherTemp.innerHTML = `${temperature}°c`;
  console.log(temperature);
};
//WEATHER ENDS
