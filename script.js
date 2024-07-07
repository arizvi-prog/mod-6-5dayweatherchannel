const apiKey = '0acc098a64b3bd77fd4981e796d05c10';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = searchInput.value.trim();
    if (cityName) {
        fetchWeather(cityName);
    }
});

async function fetchWeather(cityName) {
    try {
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
        
        if (!currentWeatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Failed to fetch weather');
        }
        
        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        if (forecastData.cod && forecastData.cod === '404') {
            throw new Error('City not found');
        }
        
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
        saveToLocalStorage(cityName);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('City not found. Please enter a valid city name.');
    }
}

function displayCurrentWeather(data) {
    const { name, main, weather, wind } = data;
    currentWeather.innerHTML = `
        <h2>${name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="weather-icon">
    `;
}

function displayForecast(data) {
    const forecasts = data.list;
    forecastContainer.innerHTML = '';

    for (let i = 0; i < forecasts.length; i += 8) { 
        const forecast = forecasts[i];
        const date = new Date(forecast.dt * 1000); 
        const dateString = date.toLocaleDateString(undefined, { weekday: 'short' });

  
        const tempFahrenheit = (forecast.main.temp * 9/5) + 32;

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-item');
        forecastCard.innerHTML = `
            <p>${dateString}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="weather-icon">
            <p>Temp: ${tempFahrenheit.toFixed(1)}°F</p> <!-- Display temperature in Fahrenheit -->
            <p>Humidity: ${forecast.main.humidity}%</p>
            <p>Wind: ${forecast.wind.speed} m/s</p>
        `;
        forecastContainer.appendChild(forecastCard);
    }
}

function saveToLocalStorage(cityName) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        localStorage.setItem('cities', JSON.stringify(cities));
        displaySearchHistory();
    }
}

function displaySearchHistory() {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    searchHistory.innerHTML = '';
    cities.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', function() {
            fetchWeather(city);
        });
        searchHistory.appendChild(button);
    });
}

displaySearchHistory();

// const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

// searchForm.addEventListener('submit', function (event) {
//     event.preventDefault();
//     const cityName = searchInput.value.trim();
//     if (cityName) {
//         fetchWeather(cityName);
//     }
// });

// async function fetchWeather(cityName) {
//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
//         if (!response.ok) {
//             throw new Error('City not found');
//         }
//         const data = await response.json();
//         displayCurrentWeather(currentWeatherdata);
//         displayForecast(forecastData);
//         saveToLocalStorage(cityName);
//     } catch (error) {
//         console.error('Error fetching weather:', error);
//         alert('City not found. Please enter a valid city name.');
//     }
// }


// //   fetchWeather(url)

// //     .then(function (responseObj) {
// //       return responseObj.json();
// //     })
// //     .then(function (data) {
// //       const html = `
// //     <h2>Temp ${data.main.temp}</h2>
// //     `;
// //       const outputDiv = document.querySelector('.output');

// //       outputDiv.innerHTML = html;
// //     })
// //     .catch(function (error) {
// //       console.log(error);
// //     });

// function displayCurrentWeather(data) {
//     const { name, main, weather, wind } = data;
//     currentWeather.innerHTML = `
//             <h2>${name}</h2>
//             <p>Date: ${new Date().toLocaleDateString()}</p>
//             <p>Temperature: ${main.temp}°C</p>
//             <p>Humidity: ${main.humidity}%</p>
//             <p>Wind Speed: ${wind.speed} m/s</p>
//             <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="weather-icon">
//         `;
// }

// function saveToLocalStorage(cityName) {
//     let cities = JSON.parse(localStorage.getItem('cities')) || [];
//     if (!cities.includes(cityName)) {
//         cities.push(cityName);
//         localStorage.setItem('cities', JSON.stringify(cities));
//         displaySearchHistory();
//     }
// }

// function displaySearchHistory() {
//     const cities = JSON.parse(localStorage.getItem('cities')) || [];
//     searchHistory.innerHTML = '';
//     cities.forEach(city => {
//         const button = document.createElement('button');
//         button.textContent = city;
//         button.addEventListener('click', function () {
//             fetchWeather(city);
//         });
//         searchHistory.appendChild(button);
//     });
// }


// displaySearchHistory();