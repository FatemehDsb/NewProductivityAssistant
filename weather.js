//WEATHER STARTS
// Funktionen getPerson
let getWeather = async () => {
  let response = await axios.get(
    "https://api.open-meteo.com/v1/forecast?latitude=59.3294&longitude=18.0687&current=temperature_2m,weather_code&wind_speed_unit=mph&timeformat=unixtime&timezone=Europe%2FBerlin",
    {
      params: {
        inc: "latitude, longitude, timezone, current",
      },
    }
  );
  return response.data.results[0];
};

let weather = await getWeather();
let temperature = weather.current.temperature_2m;

weatherTemp.innerHTML = `${temperature}°c`;

//WEATHER ENDS
