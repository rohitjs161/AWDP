
const temp = document.querySelector('.temp');
const cityname = document.querySelector('.city');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const input = document.querySelector('input');
const button = document.querySelector('button');
const weatherIcon = document.querySelector('.weather-icon');
const errorBox = document.querySelector('.error');
const weather = document.querySelector('.weather');
const details = document.querySelector('.details');
const grantAccess = document.querySelector('.grantaccess');
const grantbtn = document.querySelector('.grantaccess button');
const loading = document.querySelector('.loading');

const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apikey = "9e3307ee9067ffa286c9fa748646626b";
let timeoutId;

async function checkweather(city) {
    try {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        loading.style.display = 'inline-block';
        weather.style.display = 'none';
        details.style.display = 'none';
        errorBox.style.display = 'none';
        grantAccess.style.display = 'none';

        const response = await fetch(apiurl + city + `&appid=${apikey}`);
        let data = await response.json();

        if(!response.ok){
            throw new Error(data.message)
        }
        timeoutId = setTimeout(()=>{
        loading.style.display = 'none';
        temp.innerHTML = Math.round(data.main.temp) + "°C";
        cityname.innerHTML = data.name;
        humidity.innerHTML = data.main.humidity + "%";
        wind.innerHTML = data.wind.speed + " km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "img/clouds.png";
        }

        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "img/clear.png";
        }
        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "img/drizzle.png";
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "img/mist.png";
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "img/rain.png";
        }
        else {
            weatherIcon.src = "img/snow.png";
        }
        
        loading.style.display = 'none';
        weather.style.display = 'block';
        details.style.display = 'flex';
    },2000)

    } catch (error) {
        clearTimeout(timeoutId)
        loading.style.display = 'none';
        weather.style.display = 'none';
        details.style.display = 'none';
        grantAccess.style.display = 'none';
        errorBox.style.display = 'block';
    }

}

button.addEventListener('click', () => {
    checkweather(((input.value).toLowerCase()).trim());
})

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkweather(((input.value).toLowerCase()).trim());
    }
});

grantbtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

async function showPosition(position) {

    loading.style.display = 'inline-block';
    weather.style.display = 'none';
    details.style.display = 'none';
    errorBox.style.display = 'none';
    grantAccess.style.display = 'none';

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const reverseGeocodeUrl = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`);
    const data = await reverseGeocodeUrl.json();
    loading.style.display = 'none';
    const city = data.name;
    checkweather(city);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }
}