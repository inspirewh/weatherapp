// when the user clicks on the "search button" 
//(target the form using the id "search-form" & add prevent default so the page doesn't reload)
const searchForm = document.getElementById('search-form')
const inputSearch = document.getElementById('input-search');
//create API averiable so it is easily accesisble throughout the document
const apiKey = 'c21164eb0007b0ffdee76492bd7bfff4';
const currentDayCity = document.getElementById('current-day-city')
//const cityName = document.getElementById('city-name')
//create a function that searches for the city
//the call back from api is missing UV therefore a second call is required

function generateIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

function getOneCallApi(lon, lat,){

    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(function(res){
        return res.json()
    })
}

function getWeatherData(city){
    
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(function(response){
        return response.json()
    
    })
    
    .then(function(currentWeather){
        const cityName = $("#city-name").text(currentWeather.name);
        const datetime = moment(currentWeather.dt, 'X').format("DD-MM-YYYY");
        const weatherIcon = $("<img>");
        weatherIcon.attr("src", "https://openweathermap.org/img/w/" + currentWeather.weather[0].icon + ".png" 
        );
        cityName.append(currentDayCity, " ", datetime, weatherIcon);
        //store the city name - into local storage
        localStorage.setItem("City Name", currentWeather.name);
        
        //console.log("City Name" + currentWeather.name)
        
       //$(currentDayCity).text(currentWeather.name);
        //localStorage.setItem("Cityname", currentWeather.name)
        //const cityName = $("#city-name")
        
        return getOneCallApi(currentWeather.coord.lon, currentWeather.coord.lat, currentWeather.dt, currentWeather.name)
    })


        

}

searchForm.addEventListener('submit', function(event){
    event.preventDefault();
    //get the user input (by targeting the id "input search" and getting the value)
    const userInput = inputSearch.value;
    //send request to weather dasboard api
    
    //fetch weather data based on city name input (create a function that fetches)
    getWeatherData(userInput)
    .then(function(weatherData){
        console.log(weatherData);
        
        //const weatherIcon = $("<img>");
        //weatherIcon.attr("src", "https://openweathermap.org/img/w/" + weatherData.current.weather[0].icon + ".png" 
        //);
        //once we have the data
        //populate the data into the DOM
        //current card: city name, date icon
        $("#current-icon").empty();
        //$("#current-icon").append(weatherIcon);

        $("#current-temp").text(weatherData.current.temp + "F");
        $("#current-humidity").text(weatherData.current.humidity + "%");
        $("#current-wind").text(weatherData.current.wind_speed + " km/h");
        //$("#current-uv").text(weatherData.daily[0].uvi);
        
        const uvIndex = weatherData.daily[0].uvi;
        const uvIndexBtn = $("#current-uv");
        var bgColor;

        if (uvIndex <= 3) {
            bgColor = "green";        
        }

        else if (uvIndex > 3 && uvIndex <= 6) {
            bgColor = "yellow";
          }
          else if (uvIndex > 6 && uvIndex <= 9) {
            bgColor = "orange";
          }
          else {
            bgColor = "red";
          }

          uvIndexBtn.addClass("btn btn-custom");
          uvIndexBtn.attr("style", ("background-color:" + bgColor));
          $("#current-uv").append(uvIndexBtn).text(weatherData.daily[0].uvi);

        //show weather per day - 5 day forecast for the search city
        //loop through the daily response array

        const daily = weatherData.daily;
        console.log(daily);
        $("#weather-cards").empty();

        for (i = 1; i < 6; i++) {
            const forecastData = document.createElement("div")
            forecastData.classList.add("col-sm-2");

            const dailyDate = moment.unix(daily[i].dt).format("DD/MM/YYYY");
            const dailyTemp = daily[i].temp.day + "F";
            const dailyHum = daily[i].humidity + "%";
            const dailyWind = daily[i].wind_speed + " km/h";
            const dailyIcon = $("<img>");
            dailyIcon.attr("src", "https://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png" 
            );
            //const dailyIcon = daily[i].weather[0].icon;
            forecastData.innerHTML= `
            <div class="card">
            <div class="card-body forecast-cards">            
              <h5 class="card-title forecast-date">${dailyDate}</h5>
              <span id="current-icon"><img src=${
                "https://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png" }></span>
              <p>Temp: <span id="forecast-temp1">${dailyTemp}</span></p>
              <p>Wind: <span id="forecast-wind1">${dailyWind}</span></p>
              <p>Humidity: <span id="forecast-humidity1">${dailyHum}</span></p>
            </div>
          </div>
            `


            console.log(dailyDate);
            

            //creates dynamic elements
           // $(".forecast-date").append(dailyDate);


            //adds text to dynamic elements
           //dateTag.text(dailyDate);




            //$("#forecast-date").text(dailyDate);

            //const forecastDate = $('<h5 class="card-title forecast-date">')

                
            //})
            document.querySelector("#weather-cards").appendChild(forecastData)

        }

        citySearchList();
        
    })
    
function citySearchList(){
    cityHistory = localStorage.getItem("City Name")
    console.log("City Name" + localStorage.getItem("City Name"));
    
    //render the hiostory into the search list
    if (cityHistory !== null) {
        // alert("inside citySearchList");
         const cityList = $("<button>");
         cityList.addClass("list-group-item d-flex justify-content-between align-items-center");
         cityList.text(cityHistory);
         $("ul").prepend(cityList);
         $(inputSearch).val("");
       }
     }

    // $("ul").on("click", "button", function () {
        //alert("inside ul");
        //cityHistory = $(this).text();
      //  console.log(cityHistory);
      
      //  getWeatherData(cityHistory);
     // })

      $("#recent-city-list").on("click", "button", function (event) {
        event.preventDefault();
        const city = $(this).text();
    
        getWeatherData(city);
    
        $("#current-weather").show();
        $("#forecast-weather").show();


      });

      if(getWeatherData.status == 404) {
        alert("This is not a valid City");
        return;
      }

})

$("#clear-history").on("click", function (event) {
    event.preventDefault();
    cityList = [];
    localStorage.removeItem("City Name");
    document.location.reload();
  });







