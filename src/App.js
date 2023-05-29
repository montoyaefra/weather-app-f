import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [city, setCity] = useState("Paris");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      // dynamic bg
      const threshold = units === "metric" ? 20 : 60;
      if (data.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="app w-100 vh" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay container w-100 vh-100">
        {weather && (
          <div className="d-flex flex-column align-items-center justify-content-between gap-4 p-5  flex-wrap 100">
            <div className="section__inputs w-50 d-flex flex-wrap p-3 border border-white rounded-3 text-white align-items-center justify-content-between">
              <input
              className=" input border rounded-4  p-1 fs-4 fw-normal w-75" 
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter City..."
              />
              <button className="btn bg-white fw-normal fs-3  border-0 py-2 px-4" onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>

            <div className="section__temperature w-50 d-flex justify-content-between align-items-center border rounded-4 p-4">
              <div className="icon d-flex flex-column align-items-center justify-justify-content-center flex-wrap">
                <h3 className="fs-5 fw-bold text-capitalize text-white">{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3 className="text-white fst-italic">{weather.description}</h3>
              </div>
              <div className="temperature d-flex flex-wrap">
                <h1 className="fs-1 text-white">{`${weather.temp.toFixed()} °${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>

            {/* bottom description */}
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;