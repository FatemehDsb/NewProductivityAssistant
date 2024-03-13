//https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code&wind_speed_unit=ms&timeformat=unixtime&timezone=Europe%2FBerlin

let getWeather = async (lat, lon, timezone) => {
  return axios.get("https://api.open-meteo.com/v1/forecast", {
    params: { latitude: lat, longitude: lon, timezone },
  });
};
