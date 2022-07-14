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
        console.log(datetime);
        cityName.append(currentDayCity, " ", datetime);
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

        const weatherIcon = $("<img>");
        weatherIcon.attr("src", "https://openweathermap.org/img/w/" + weatherData.current.weather[0].icon + ".png" 
        );
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);


        
    })
    
    //once we have the data
    //populate the data into the DOM



    //current card: city name, date icon



    //store the city name - into local storage
    //render the hiostory into the search list

})


